import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { reservations, type reservationStatusEnum } from "@/db/schema";
import { toZonedHHMM } from "@/lib/availability";

export type ReservationStatus = (typeof reservationStatusEnum.enumValues)[number];
export type ReservationRow = typeof reservations.$inferSelect;

const ACTIVE_STATUSES: ReservationStatus[] = ["pending", "confirmed"];

export interface CreateReservationInput {
  name: string;
  email: string;
  phone: string;
  partySize: number;
  startsAt: Date;
  endsAt: Date;
  notes?: string;
  locale: string;
}

/** "HH:mm" (café-local) → total covers already booked, for every active reservation on that date. */
export async function getBookedCoversByTime(dayStartUtc: Date, dayEndUtc: Date): Promise<Record<string, number>> {
  const db = getDb();
  const rows = await db
    .select({ startsAt: reservations.startsAt, partySize: reservations.partySize })
    .from(reservations)
    .where(
      and(
        gte(reservations.startsAt, dayStartUtc),
        lt(reservations.startsAt, dayEndUtc),
        inArray(reservations.status, ACTIVE_STATUSES)
      )
    );

  const map: Record<string, number> = {};
  for (const row of rows) {
    const key = toZonedHHMM(row.startsAt);
    map[key] = (map[key] ?? 0) + row.partySize;
  }
  return map;
}

/**
 * Atomically checks remaining slot capacity and inserts in a single statement, so two
 * concurrent submissions for the same slot can't both slip past the capacity check.
 * A Postgres advisory lock (scoped to this exact starts_at) serializes concurrent
 * attempts at the same slot; everything else proceeds unblocked. Returns null when
 * the slot is full.
 */
export async function createReservationAtomic(
  input: CreateReservationInput,
  maxCoversPerSlot: number
): Promise<{ id: string } | null> {
  const db = getDb();
  const lockKey = input.startsAt.toISOString();

  const result = await db.execute<{ id: string }>(sql`
    WITH lock AS MATERIALIZED (
      SELECT pg_advisory_xact_lock(hashtext(${lockKey}))
    ),
    load AS (
      SELECT COALESCE(SUM(party_size), 0)::int AS booked
      FROM ${reservations}, lock
      WHERE ${reservations.startsAt} = ${input.startsAt}
        AND ${reservations.status} IN ('pending', 'confirmed')
    )
    INSERT INTO ${reservations} (name, email, phone, party_size, starts_at, ends_at, notes, locale, consent_at, status)
    SELECT ${input.name}, ${input.email}, ${input.phone}, ${input.partySize}, ${input.startsAt}, ${input.endsAt}, ${input.notes ?? null}, ${input.locale}, now(), 'pending'
    FROM lock
    WHERE (SELECT booked FROM load) + ${input.partySize} <= ${maxCoversPerSlot}
    RETURNING id
  `);

  return result.rows[0] ? { id: result.rows[0].id } : null;
}

export async function listReservations(filters: {
  from?: Date;
  to?: Date;
  status?: ReservationStatus;
  search?: string;
}) {
  const db = getDb();
  const conditions = [];
  if (filters.from) conditions.push(gte(reservations.startsAt, filters.from));
  if (filters.to) conditions.push(lt(reservations.startsAt, filters.to));
  if (filters.status) conditions.push(eq(reservations.status, filters.status));

  const rows = await db
    .select()
    .from(reservations)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(reservations.startsAt));

  if (!filters.search) return rows;
  const needle = filters.search.trim().toLowerCase();
  return rows.filter(
    (r) => r.name.toLowerCase().includes(needle) || r.email.toLowerCase().includes(needle)
  );
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  const db = getDb();
  const [row] = await db
    .update(reservations)
    .set({ status, updatedAt: new Date() })
    .where(eq(reservations.id, id))
    .returning();
  return row;
}

export async function getReservationById(id: string) {
  const db = getDb();
  const [row] = await db.select().from(reservations).where(eq(reservations.id, id));
  return row;
}

export async function getTodayReservationStats(dayStartUtc: Date, dayEndUtc: Date) {
  const db = getDb();
  const rows = await db
    .select({ status: reservations.status, partySize: reservations.partySize })
    .from(reservations)
    .where(and(gte(reservations.startsAt, dayStartUtc), lt(reservations.startsAt, dayEndUtc)));

  return {
    total: rows.length,
    guests: rows.reduce((sum, r) => sum + r.partySize, 0),
    pending: rows.filter((r) => r.status === "pending").length,
    confirmed: rows.filter((r) => r.status === "confirmed").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };
}
