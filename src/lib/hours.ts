import { toZonedTime } from "date-fns-tz";
import { TIMEZONE, type DayHours, type WeekdayIndex } from "@/lib/business";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface OpenStatus {
  isOpen: boolean;
  today: DayHours | undefined;
  nextChangeLabel: "opensAt" | "opensTomorrow" | "closesAt" | null;
  nextChangeTime: string | null; // "HH:mm"
}

/** Computes live open/closed status from weekly hours, in the café's timezone. */
export function getOpenStatus(hours: DayHours[], at: Date = new Date()): OpenStatus {
  const zoned = toZonedTime(at, TIMEZONE);
  const day = zoned.getDay() as WeekdayIndex;
  const nowMinutes = zoned.getHours() * 60 + zoned.getMinutes();
  const today = hours.find((h) => h.day === day);

  if (today?.open && today.close) {
    const open = toMinutes(today.open);
    let close = toMinutes(today.close);
    if (close <= open) close += 24 * 60; // crosses midnight
    if (nowMinutes >= open && nowMinutes < close) {
      return { isOpen: true, today, nextChangeLabel: "closesAt", nextChangeTime: today.close };
    }
    if (nowMinutes < open) {
      return { isOpen: false, today, nextChangeLabel: "opensAt", nextChangeTime: today.open };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const nextDay = ((day + i) % 7) as WeekdayIndex;
    const candidate = hours.find((h) => h.day === nextDay && h.open);
    if (candidate?.open) {
      return {
        isOpen: false,
        today,
        nextChangeLabel: i === 1 ? "opensTomorrow" : "opensAt",
        nextChangeTime: candidate.open,
      };
    }
  }

  return { isOpen: false, today, nextChangeLabel: null, nextChangeTime: null };
}

export interface WeeklyHoursGroup {
  days: WeekdayIndex[];
  open: string | null;
  close: string | null;
}

/** Collapses the week (starting Monday) into runs of consecutive identical days. */
export function groupWeeklyHours(hours: DayHours[]): WeeklyHoursGroup[] {
  const order: WeekdayIndex[] = [1, 2, 3, 4, 5, 6, 0];
  const sorted = order
    .map((d) => hours.find((h) => h.day === d))
    .filter((h): h is DayHours => Boolean(h));

  const groups: WeeklyHoursGroup[] = [];
  for (const day of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.open === day.open && last.close === day.close) {
      last.days.push(day.day);
    } else {
      groups.push({ days: [day.day], open: day.open, close: day.close });
    }
  }
  return groups;
}

export function formatHour(hhmm: string, locale: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(Date.UTC(2000, 0, 1, h, m));
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    hour: "numeric",
    minute: m === 0 ? undefined : "2-digit",
    hour12: locale !== "fr",
    timeZone: "UTC",
  }).format(d);
}
