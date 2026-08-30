import { Text } from "@react-email/components";
import { EmailLayout, emailTextStyles, colors } from "@/emails/components/layout";
import type { ReservationEmailProps } from "@/emails/reservation-received";

const COPY = {
  fr: {
    preview: "Votre table est confirmée !",
    heading: "Réservation confirmée",
    intro: (name: string) => `Bonjour ${name}, votre table est confirmée. Au plaisir de vous accueillir !`,
    date: "Date",
    time: "Heure",
    guests: "Convives",
  },
  en: {
    preview: "Your table is confirmed!",
    heading: "Reservation confirmed",
    intro: (name: string) => `Hi ${name}, your table is confirmed. We look forward to having you!`,
    date: "Date",
    time: "Time",
    guests: "Guests",
  },
};

export default function ReservationConfirmedEmail({
  locale,
  name,
  dateLabel,
  timeLabel,
  partySize,
}: ReservationEmailProps) {
  const t = COPY[locale];
  return (
    <EmailLayout previewText={t.preview}>
      <Text style={{ ...emailTextStyles.heading, color: colors.rust }}>{t.heading}</Text>
      <Text style={emailTextStyles.body}>{t.intro(name)}</Text>

      <Text style={emailTextStyles.label}>{t.date}</Text>
      <Text style={emailTextStyles.value}>{dateLabel}</Text>

      <Text style={emailTextStyles.label}>{t.time}</Text>
      <Text style={emailTextStyles.value}>{timeLabel}</Text>

      <Text style={emailTextStyles.label}>{t.guests}</Text>
      <Text style={emailTextStyles.value}>{partySize}</Text>
    </EmailLayout>
  );
}
