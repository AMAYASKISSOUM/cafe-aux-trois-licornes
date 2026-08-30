import { describe, expect, it } from "vitest";
import { fromZonedTime } from "date-fns-tz";
import {
  filterSlotsByCapacity,
  generateTimeSlots,
  isDateBookable,
  isValidPartySize,
  weekdayOf,
  type DayHoursLite,
  type ReservationPolicy,
  type SpecialDayOverride,
} from "@/lib/availability";
import { TIMEZONE, type WeekdayIndex } from "@/lib/business";

const NOW = fromZonedTime("2026-09-01T08:00:00", TIMEZONE); // a Tuesday, 08:00 local

const OPEN: DayHoursLite = { open: "09:00", close: "17:00" };
const CLOSED: DayHoursLite = { open: null, close: null };

function allDays(hours: DayHoursLite): Record<WeekdayIndex, DayHoursLite> {
  return { 0: hours, 1: hours, 2: hours, 3: hours, 4: hours, 5: hours, 6: hours };
}

const POLICY: ReservationPolicy = {
  reservationsEnabled: true,
  slotLengthMinutes: 30,
  defaultDurationMinutes: 60,
  maxPartySize: 8,
  maxCoversPerSlot: 20,
  minAdvanceNoticeMinutes: 60,
  maxAdvanceDays: 30,
};

describe("generateTimeSlots", () => {
  it("lists every slot that leaves room for the full duration before close", () => {
    const slots = generateTimeSlots("2026-09-10", allDays(OPEN), [], POLICY, NOW);
    expect(slots[0]).toBe("09:00");
    expect(slots.at(-1)).toBe("16:00"); // last slot + 60min duration ends exactly at 17:00
    expect(slots).toHaveLength(15);
  });

  it("returns nothing on a day with no hours (closed day)", () => {
    const slots = generateTimeSlots("2026-09-10", allDays(CLOSED), [], POLICY, NOW);
    expect(slots).toEqual([]);
  });

  it("excludes slots inside the minimum advance notice window", () => {
    // NOW is 08:00 local on 2026-09-01; 60min notice pushes the earliest bookable slot to 09:00.
    const slots = generateTimeSlots("2026-09-01", allDays(OPEN), [], POLICY, NOW);
    expect(slots[0]).toBe("09:00");

    const laterNow = fromZonedTime("2026-09-01T08:31:00", TIMEZONE);
    const laterSlots = generateTimeSlots("2026-09-01", allDays(OPEN), [], POLICY, laterNow);
    expect(laterSlots[0]).toBe("10:00"); // 09:00 and 09:30 both fall before 09:31 + notice
  });

  it("honors a blackout date (special hours marked closed) even on a normally open day", () => {
    const blackout: SpecialDayOverride[] = [
      { date: "2026-09-10", isClosed: true, open: null, close: null, blocksReservations: true },
    ];
    expect(generateTimeSlots("2026-09-10", allDays(OPEN), blackout, POLICY, NOW)).toEqual([]);
  });

  it("uses special (holiday) hours instead of the regular weekly schedule", () => {
    const holiday: SpecialDayOverride[] = [
      { date: "2026-09-10", isClosed: false, open: "10:00", close: "14:00", blocksReservations: false },
    ];
    const slots = generateTimeSlots("2026-09-10", allDays(OPEN), holiday, POLICY, NOW);
    expect(slots[0]).toBe("10:00");
    expect(slots.at(-1)).toBe("13:00");
  });

  it("returns nothing when reservations are disabled", () => {
    const slots = generateTimeSlots("2026-09-10", allDays(OPEN), [], { ...POLICY, reservationsEnabled: false }, NOW);
    expect(slots).toEqual([]);
  });
});

describe("isDateBookable", () => {
  it("rejects a date in the past", () => {
    expect(isDateBookable("2026-08-31", allDays(OPEN), [], POLICY, NOW)).toEqual({
      bookable: false,
      reason: "past",
    });
  });

  it("accepts today", () => {
    expect(isDateBookable("2026-09-01", allDays(OPEN), [], POLICY, NOW).bookable).toBe(true);
  });

  it("rejects a date beyond the max advance window", () => {
    expect(isDateBookable("2026-12-01", allDays(OPEN), [], POLICY, NOW)).toEqual({
      bookable: false,
      reason: "too-far",
    });
  });

  it("accepts the last day inside the max advance window", () => {
    expect(isDateBookable("2026-10-01", allDays(OPEN), [], POLICY, NOW).bookable).toBe(true);
  });
});

describe("weekdayOf", () => {
  it("matches the real calendar day of week in the café's timezone", () => {
    expect(weekdayOf("2026-09-01")).toBe(2); // Tuesday
    expect(weekdayOf("2026-09-06")).toBe(0); // Sunday
  });
});

describe("filterSlotsByCapacity", () => {
  it("drops a slot once it would exceed max covers", () => {
    const result = filterSlotsByCapacity(["12:00", "12:30"], 4, { "12:00": 18 }, 20);
    expect(result).toEqual(["12:30"]);
  });

  it("allows a party that exactly fills remaining capacity", () => {
    const result = filterSlotsByCapacity(["12:00"], 2, { "12:00": 18 }, 20);
    expect(result).toEqual(["12:00"]);
  });

  it("treats an unbooked slot as having zero covers", () => {
    const result = filterSlotsByCapacity(["18:00"], 8, {}, 20);
    expect(result).toEqual(["18:00"]);
  });
});

describe("isValidPartySize", () => {
  it("accepts sizes within range", () => {
    expect(isValidPartySize(1, POLICY)).toBe(true);
    expect(isValidPartySize(8, POLICY)).toBe(true);
  });

  it("rejects zero, negatives, non-integers and sizes over the max", () => {
    expect(isValidPartySize(0, POLICY)).toBe(false);
    expect(isValidPartySize(-1, POLICY)).toBe(false);
    expect(isValidPartySize(2.5, POLICY)).toBe(false);
    expect(isValidPartySize(9, POLICY)).toBe(false);
  });
});
