"use server";

import { headers } from "next/headers";
import { addMinutes } from "date-fns";
import { isDatabaseConfigured } from "@/db";
import { buildReservationSchema } from "@/lib/reservation-schema";
import { getReservationPolicy, getWeeklyHours, getSpecialHours } from "@/lib/settings-service";
import {
  generateTimeSlots,
  filterSlotsByCapacity,
  isDateBookable,
  isValidPartySize,
  toUtcInstant,
} from "@/lib/availability";
import { getBookedCoversByTime, createReservationAtomic } from "@/lib/reservations-service";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendReservationReceivedEmail } from "@/lib/email";
import { formatHour } from "@/lib/hours";

export interface AvailableSlotsResult {
  slots: string[];
  maxPartySize: number;
  bookable: boolean;
}

export async function getAvailableSlotsAction(date: string, partySize: number): Promise<AvailableSlotsResult> {
  const policy = await getReservationPolicy();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { slots: [], maxPartySize: policy.maxPartySize, bookable: false };
  }

  const [weeklyHours, specialHours] = await Promise.all([getWeeklyHours(), getSpecialHours()]);
  const safeSize = isValidPartySize(partySize, policy) ? Math.trunc(partySize) : 1;

  let slots = generateTimeSlots(date, weeklyHours, specialHours, policy);

  if (isDatabaseConfigured() && slots.length > 0) {
    try {
      const dayStart = toUtcInstant(date, "00:00");
      const dayEnd = addMinutes(dayStart, 24 * 60);
      const booked = await getBookedCoversByTime(dayStart, dayEnd);
      slots = filterSlotsByCapacity(slots, safeSize, booked, policy.maxCoversPerSlot);
    } catch (err) {
      console.error("getAvailableSlotsAction: capacity lookup failed", err);
    }
  }

  return { slots, maxPartySize: policy.maxPartySize, bookable: slots.length > 0 };
}

export interface SubmitReservationResult {
  success: boolean;
  id?: string;
  error?: "validation" | "rate-limited" | "unavailable" | "full" | "server" | "demo";
  fieldErrors?: Partial<Record<string, string>>;
}

export async function submitReservationAction(
  raw: Record<string, unknown>,
  locale: "fr" | "en"
): Promise<SubmitReservationResult> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(`reservation:${ip}`, 5, 10 * 60 * 1000)) {
    return { success: false, error: "rate-limited" };
  }

  const policy = await getReservationPolicy();
  const schema = buildReservationSchema(policy.maxPartySize, locale);
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, error: "validation", fieldErrors };
  }

  const data = parsed.data;

  // Honeypot tripped: pretend success so the bot doesn't learn anything, but write nothing.
  if (data.company) {
    return { success: true, id: "ok" };
  }

  if (!isDatabaseConfigured() || !policy.reservationsEnabled) {
    return { success: false, error: "demo" };
  }

  const [weeklyHours, specialHours] = await Promise.all([getWeeklyHours(), getSpecialHours()]);
  const dateCheck = isDateBookable(data.date, weeklyHours, specialHours, policy);
  if (!dateCheck.bookable) {
    return { success: false, error: "unavailable" };
  }

  const startsAt = toUtcInstant(data.date, data.time);
  const endsAt = addMinutes(startsAt, policy.defaultDurationMinutes);

  try {
    const created = await createReservationAtomic(
      {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        partySize: data.partySize,
        startsAt,
        endsAt,
        notes: data.notes || undefined,
        locale,
      },
      policy.maxCoversPerSlot
    );

    if (!created) {
      return { success: false, error: "full" };
    }

    void sendReservationReceivedEmail({
      to: data.email,
      locale,
      name: data.fullName,
      dateLabel: startsAt.toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Toronto",
      }),
      timeLabel: formatHour(data.time, locale),
      partySize: data.partySize,
      notes: data.notes || undefined,
    }).catch((err) => console.error("reservation received email failed", err));

    return { success: true, id: created.id };
  } catch (err) {
    console.error("submitReservationAction: insert failed", err);
    return { success: false, error: "server" };
  }
}
