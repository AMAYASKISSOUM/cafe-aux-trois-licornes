import { Resend } from "resend";
import ReservationReceivedEmail from "@/emails/reservation-received";
import ReservationConfirmedEmail from "@/emails/reservation-confirmed";
import ReservationCancelledEmail from "@/emails/reservation-cancelled";

export interface ReservationEmailInput {
  to: string;
  locale: "fr" | "en";
  name: string;
  dateLabel: string;
  timeLabel: string;
  partySize: number;
  notes?: string;
}

const SUBJECTS = {
  received: { fr: "Demande de réservation reçue", en: "Reservation request received" },
  confirmed: { fr: "Réservation confirmée", en: "Reservation confirmed" },
  cancelled: { fr: "Réservation annulée", en: "Reservation cancelled" },
};

const FROM = process.env.RESEND_FROM_EMAIL || "Café Aux Trois Licornes <onboarding@resend.dev>";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

/** No-ops (with a log line) when RESEND_API_KEY is unset — never throws, never blocks a reservation. */
async function dispatch(to: string, subject: string, react: React.ReactElement) {
  const client = getClient();
  if (!client) {
    console.info(`[email] RESEND_API_KEY not set — skipped "${subject}" to ${to}`);
    return;
  }
  try {
    await client.emails.send({ from: FROM, to, subject, react });
  } catch (err) {
    console.error("[email] send failed", err);
  }
}

export async function sendReservationReceivedEmail(input: ReservationEmailInput) {
  await dispatch(
    input.to,
    SUBJECTS.received[input.locale],
    <ReservationReceivedEmail
      locale={input.locale}
      name={input.name}
      dateLabel={input.dateLabel}
      timeLabel={input.timeLabel}
      partySize={input.partySize}
      notes={input.notes}
    />
  );
}

export async function sendReservationConfirmedEmail(input: ReservationEmailInput) {
  await dispatch(
    input.to,
    SUBJECTS.confirmed[input.locale],
    <ReservationConfirmedEmail
      locale={input.locale}
      name={input.name}
      dateLabel={input.dateLabel}
      timeLabel={input.timeLabel}
      partySize={input.partySize}
    />
  );
}

export async function sendReservationCancelledEmail(input: ReservationEmailInput) {
  await dispatch(
    input.to,
    SUBJECTS.cancelled[input.locale],
    <ReservationCancelledEmail
      locale={input.locale}
      name={input.name}
      dateLabel={input.dateLabel}
      timeLabel={input.timeLabel}
      partySize={input.partySize}
    />
  );
}
