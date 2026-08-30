import { isBefore, addMinutes } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { TIMEZONE, type WeekdayIndex } from "@/lib/business";

export interface ReservationPolicy {
  reservationsEnabled: boolean;
  slotLengthMinutes: number;
  defaultDurationMinutes: number;
  maxPartySize: number;
  maxCoversPerSlot: number;
  minAdvanceNoticeMinutes: number;
  maxAdvanceDays: number;
}

export interface DayHoursLite {
  open: string | null;
  close: string | null;
}

export interface SpecialDayOverride {
  date: string; // "YYYY-MM-DD"
  isClosed: boolean;
  open: string | null;
  close: string | null;
  blocksReservations: boolean;
  label?: string | null;
}

export type BookableReason = "disabled" | "past" | "too-far" | "closed";

/** Wall-clock date (YYYY-MM-DD) → the day-of-week it falls on, in the café's timezone. */
export function weekdayOf(dateStr: string): WeekdayIndex {
  const instant = fromZonedTime(`${dateStr}T12:00:00`, TIMEZONE);
  return toZonedTime(instant, TIMEZONE).getDay() as WeekdayIndex;
}

/** A wall-clock date+time in the café's timezone → the real UTC instant it refers to. */
export function toUtcInstant(dateStr: string, timeStr: string): Date {
  return fromZonedTime(`${dateStr}T${timeStr}:00`, TIMEZONE);
}

export function todayKey(now: Date = new Date()): string {
  return formatDateKey(toZonedTime(now, TIMEZONE));
}

export function dateKeyPlusDays(days: number, now: Date = new Date()): string {
  const d = toZonedTime(now, TIMEZONE);
  d.setDate(d.getDate() + days);
  return formatDateKey(d);
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function getEffectiveHours(
  dateStr: string,
  weeklyHours: Partial<Record<WeekdayIndex, DayHoursLite>>,
  specialHours: SpecialDayOverride[]
): { open: string | null; close: string | null; blocksReservations: boolean; label?: string | null } {
  const special = specialHours.find((s) => s.date === dateStr);
  if (special) {
    return {
      open: special.isClosed ? null : special.open,
      close: special.isClosed ? null : special.close,
      blocksReservations: special.blocksReservations || special.isClosed,
      label: special.label ?? null,
    };
  }
  const regular = weeklyHours[weekdayOf(dateStr)];
  return { open: regular?.open ?? null, close: regular?.close ?? null, blocksReservations: false };
}

export function isDateBookable(
  dateStr: string,
  weeklyHours: Partial<Record<WeekdayIndex, DayHoursLite>>,
  specialHours: SpecialDayOverride[],
  policy: ReservationPolicy,
  now: Date = new Date()
): { bookable: boolean; reason?: BookableReason } {
  if (!policy.reservationsEnabled) return { bookable: false, reason: "disabled" };

  const today = todayKey(now);
  if (dateStr < today) return { bookable: false, reason: "past" };

  const zonedNow = toZonedTime(now, TIMEZONE);
  const maxDate = new Date(zonedNow);
  maxDate.setDate(maxDate.getDate() + policy.maxAdvanceDays);
  if (dateStr > formatDateKey(maxDate)) return { bookable: false, reason: "too-far" };

  const effective = getEffectiveHours(dateStr, weeklyHours, specialHours);
  if (!effective.open || !effective.close || effective.blocksReservations) {
    return { bookable: false, reason: "closed" };
  }

  return { bookable: true };
}

/** Pure: which "HH:mm" slots exist for a date, given hours + advance notice. No capacity check. */
export function generateTimeSlots(
  dateStr: string,
  weeklyHours: Partial<Record<WeekdayIndex, DayHoursLite>>,
  specialHours: SpecialDayOverride[],
  policy: ReservationPolicy,
  now: Date = new Date()
): string[] {
  const check = isDateBookable(dateStr, weeklyHours, specialHours, policy, now);
  if (!check.bookable) return [];

  const effective = getEffectiveHours(dateStr, weeklyHours, specialHours);
  if (!effective.open || !effective.close) return [];

  const openMinutes = toMinutes(effective.open);
  const closeMinutes = toMinutes(effective.close);
  const earliestBookable = addMinutes(now, policy.minAdvanceNoticeMinutes);

  const slots: string[] = [];
  for (
    let m = openMinutes;
    m + policy.defaultDurationMinutes <= closeMinutes;
    m += policy.slotLengthMinutes
  ) {
    const slotTime = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    if (isBefore(toUtcInstant(dateStr, slotTime), earliestBookable)) continue;
    slots.push(slotTime);
  }
  return slots;
}

/** Pure: removes slots that can't fit `requestedPartySize` given what's already booked. */
export function filterSlotsByCapacity(
  slots: string[],
  requestedPartySize: number,
  bookedCoversByTime: Record<string, number>,
  maxCoversPerSlot: number
): string[] {
  return slots.filter((time) => (bookedCoversByTime[time] ?? 0) + requestedPartySize <= maxCoversPerSlot);
}

export function isValidPartySize(size: number, policy: Pick<ReservationPolicy, "maxPartySize">): boolean {
  return Number.isInteger(size) && size >= 1 && size <= policy.maxPartySize;
}

/** A UTC instant → its wall-clock "HH:mm" in the café's timezone. */
export function toZonedHHMM(date: Date): string {
  const zoned = toZonedTime(date, TIMEZONE);
  return `${String(zoned.getHours()).padStart(2, "0")}:${String(zoned.getMinutes()).padStart(2, "0")}`;
}
