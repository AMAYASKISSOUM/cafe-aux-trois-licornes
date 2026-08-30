import { Text } from "@react-email/components";
import { EmailLayout, emailTextStyles } from "@/emails/components/layout";
import type { ReservationEmailProps } from "@/emails/reservation-received";

const COPY = {
  fr: {
    preview: "Votre réservation a été annulée.",
    heading: "Réservation annulée",
    intro: (name: string) =>
      `Bonjour ${name}, votre réservation a été annulée. Si ce n'est pas vous qui en avez fait la demande, contactez-nous.`,
    date: "Date",
    time: "Heure",
  },
  en: {
    preview: "Your reservation has been cancelled.",
    heading: "Reservation cancelled",
    intro: (name: string) =>
      `Hi ${name}, your reservation has been cancelled. If you didn't request this, please contact us.`,
    date: "Date",
    time: "Time",
  },
};

export default function ReservationCancelledEmail({
  locale,
  name,
  dateLabel,
  timeLabel,
}: ReservationEmailProps) {
  const t = COPY[locale];
  return (
    <EmailLayout previewText={t.preview}>
      <Text style={emailTextStyles.heading}>{t.heading}</Text>
      <Text style={emailTextStyles.body}>{t.intro(name)}</Text>

      <Text style={emailTextStyles.label}>{t.date}</Text>
      <Text style={emailTextStyles.value}>{dateLabel}</Text>

      <Text style={emailTextStyles.label}>{t.time}</Text>
      <Text style={emailTextStyles.value}>{timeLabel}</Text>
    </EmailLayout>
  );
}
