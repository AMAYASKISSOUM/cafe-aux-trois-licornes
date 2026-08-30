import { describe, expect, it } from "vitest";
import { buildReservationSchema } from "@/lib/reservation-schema";

const VALID = {
  date: "2026-09-10",
  time: "18:00",
  partySize: 2,
  fullName: "Alex Tremblay",
  email: "alex@example.com",
  phone: "819-555-1234",
  notes: "",
  consent: true,
  company: "",
};

describe("reservation schema", () => {
  it("accepts a fully valid submission", () => {
    const schema = buildReservationSchema(8);
    expect(schema.safeParse(VALID).success).toBe(true);
  });

  it("rejects a malformed date or time", () => {
    const schema = buildReservationSchema(8);
    expect(schema.safeParse({ ...VALID, date: "10-09-2026" }).success).toBe(false);
    expect(schema.safeParse({ ...VALID, time: "6pm" }).success).toBe(false);
  });

  it("enforces the party size ceiling from the live policy", () => {
    const schema = buildReservationSchema(4);
    expect(schema.safeParse({ ...VALID, partySize: 4 }).success).toBe(true);
    expect(schema.safeParse({ ...VALID, partySize: 5 }).success).toBe(false);
  });

  it("rejects a party size of zero or a fraction", () => {
    const schema = buildReservationSchema(8);
    expect(schema.safeParse({ ...VALID, partySize: 0 }).success).toBe(false);
    expect(schema.safeParse({ ...VALID, partySize: 2.5 }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const schema = buildReservationSchema(8);
    expect(schema.safeParse({ ...VALID, email: "not-an-email" }).success).toBe(false);
  });

  it("requires consent to be explicitly true", () => {
    const schema = buildReservationSchema(8);
    expect(schema.safeParse({ ...VALID, consent: false }).success).toBe(false);
  });

  it("rejects a filled honeypot field", () => {
    const schema = buildReservationSchema(8);
    const result = schema.safeParse({ ...VALID, company: "I am a bot" });
    // The schema itself only constrains length; actions.ts treats any non-empty value as spam.
    expect(result.success).toBe(false);
  });

  it("localizes validation messages", () => {
    const fr = buildReservationSchema(8, "fr").safeParse({ ...VALID, email: "bad" });
    const en = buildReservationSchema(8, "en").safeParse({ ...VALID, email: "bad" });
    expect(fr.success).toBe(false);
    expect(en.success).toBe(false);
    if (!fr.success && !en.success) {
      expect(fr.error.issues[0].message).not.toBe(en.error.issues[0].message);
    }
  });
});
