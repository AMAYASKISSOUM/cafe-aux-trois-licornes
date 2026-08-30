"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { openingHours, specialHours } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export async function updateWeeklyHoursAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const db = getDb();
  for (let day = 0; day <= 6; day++) {
    const closed = formData.get(`closed-${day}`) === "on";
    const open = closed ? null : (formData.get(`open-${day}`) as string) || null;
    const close = closed ? null : (formData.get(`close-${day}`) as string) || null;
    await db
      .insert(openingHours)
      .values({ dayOfWeek: day, openTime: open, closeTime: close })
      .onConflictDoUpdate({
        target: openingHours.dayOfWeek,
        set: { openTime: open, closeTime: close },
      });
  }
  revalidatePath("/admin/horaires");
  revalidatePath("/[locale]", "layout");
}

export async function addSpecialHourAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const date = formData.get("date") as string;
  if (!date) return;
  const closed = formData.get("closed") === "on";
  const open = closed ? null : (formData.get("open") as string) || null;
  const close = closed ? null : (formData.get("close") as string) || null;
  const label = (formData.get("label") as string) || null;

  const db = getDb();
  await db
    .insert(specialHours)
    .values({ date, isClosed: closed, openTime: open, closeTime: close, label, blocksReservations: closed })
    .onConflictDoUpdate({
      target: specialHours.date,
      set: { isClosed: closed, openTime: open, closeTime: close, label, blocksReservations: closed },
    });

  revalidatePath("/admin/horaires");
  revalidatePath("/[locale]", "layout");
}

export async function deleteSpecialHourAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const date = formData.get("date") as string;
  if (!date) return;
  const db = getDb();
  await db.delete(specialHours).where(eq(specialHours.date, date));
  revalidatePath("/admin/horaires");
  revalidatePath("/[locale]", "layout");
}
