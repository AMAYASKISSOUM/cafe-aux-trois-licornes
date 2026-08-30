"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import {
  updateReservationStatus,
  getReservationById,
  type ReservationStatus,
} from "@/lib/reservations-service";
import { toZonedHHMM } from "@/lib/availability";
import { formatHour } from "@/lib/hours";
import { sendReservationConfirmedEmail, sendReservationCancelledEmail } from "@/lib/email";

export async function updateReservationStatusAction(
  id: string,
  status: ReservationStatus
): Promise<{ success: boolean }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false };

  const updated = await updateReservationStatus(id, status);
  if (!updated) return { success: false };

  revalidatePath("/admin");
  revalidatePath("/admin/reservations");

  if (status === "confirmed" || status === "cancelled") {
    const locale = updated.locale === "en" ? "en" : "fr";
    const emailInput = {
      to: updated.email,
      locale: locale as "fr" | "en",
      name: updated.name,
      dateLabel: updated.startsAt.toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Toronto",
      }),
      timeLabel: formatHour(toZonedHHMM(updated.startsAt), locale),
      partySize: updated.partySize,
    };
    const send = status === "confirmed" ? sendReservationConfirmedEmail : sendReservationCancelledEmail;
    void send(emailInput).catch((err) => console.error("status change email failed", err));
  }

  return { success: true };
}

export async function getReservationDetailAction(id: string) {
  const admin = await requireAdmin();
  if (!admin) return null;
  return getReservationById(id);
}
