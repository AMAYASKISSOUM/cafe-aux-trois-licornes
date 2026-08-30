import { getDb, isDatabaseConfigured } from "@/db";
import { businessSettings, openingHours, specialHours } from "@/db/schema";
import { BUSINESS, type WeekdayIndex } from "@/lib/business";
import type { DayHoursLite, ReservationPolicy, SpecialDayOverride } from "@/lib/availability";

const FALLBACK_POLICY: ReservationPolicy = {
  reservationsEnabled: true,
  slotLengthMinutes: 30,
  defaultDurationMinutes: 60,
  maxPartySize: 8,
  maxCoversPerSlot: 20,
  minAdvanceNoticeMinutes: 60,
  maxAdvanceDays: 60,
};

function trimSeconds(value: string | null): string | null {
  return value ? value.slice(0, 5) : null;
}

/** DB-backed with a safe static fallback — never throws, never blocks page render. */
export async function getReservationPolicy(): Promise<ReservationPolicy> {
  if (!isDatabaseConfigured()) return FALLBACK_POLICY;
  try {
    const db = getDb();
    const [row] = await db.select().from(businessSettings).limit(1);
    if (!row) return FALLBACK_POLICY;
    return {
      reservationsEnabled: row.reservationsEnabled,
      slotLengthMinutes: row.slotLengthMinutes,
      defaultDurationMinutes: row.defaultDurationMinutes,
      maxPartySize: row.maxPartySize,
      maxCoversPerSlot: row.maxCoversPerSlot,
      minAdvanceNoticeMinutes: row.minAdvanceNoticeMinutes,
      maxAdvanceDays: row.maxAdvanceDays,
    };
  } catch {
    return FALLBACK_POLICY;
  }
}

export async function getWeeklyHours(): Promise<Record<WeekdayIndex, DayHoursLite>> {
  const fallback = Object.fromEntries(
    BUSINESS.defaultHours.map((h) => [h.day, { open: h.open, close: h.close }])
  ) as Record<WeekdayIndex, DayHoursLite>;

  if (!isDatabaseConfigured()) return fallback;
  try {
    const db = getDb();
    const rows = await db.select().from(openingHours);
    if (rows.length === 0) return fallback;
    const result = {} as Record<WeekdayIndex, DayHoursLite>;
    for (const row of rows) {
      result[row.dayOfWeek as WeekdayIndex] = {
        open: trimSeconds(row.openTime),
        close: trimSeconds(row.closeTime),
      };
    }
    return result;
  } catch {
    return fallback;
  }
}

export async function getSpecialHours(): Promise<SpecialDayOverride[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    const db = getDb();
    const rows = await db.select().from(specialHours);
    return rows.map((r) => ({
      date: r.date,
      isClosed: r.isClosed,
      open: trimSeconds(r.openTime),
      close: trimSeconds(r.closeTime),
      blocksReservations: r.blocksReservations,
      label: r.label,
    }));
  } catch {
    return [];
  }
}
