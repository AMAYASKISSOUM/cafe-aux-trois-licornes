import { Text } from "@react-email/components";
import { EmailLayout, emailTextStyles } from "@/emails/components/layout";

export interface ReservationEmailProps {
  locale: "fr" | "en";
  name: string;
  dateLabel: string;
  timeLabel: string;
  partySize: number;
  notes?: string;
}

const COPY = {
  fr: {
    preview: "Nous avons bien reçu votre demande de réservation.",
    heading: "Demande reçue",
    intro: (name: string) =>
      `Bonjour ${name}, nous avons bien reçu votre demande de réservation. Nous vous écrivons dès qu'elle est confirmée.`,
    date: "Date",
    time: "Heure",
    guests: "Convives",
    notes: "Notes",
    footer: "Une question? Répondez simplement à ce courriel ou appelez-nous.",
  },
  en: {
    preview: "We've received your reservation request.",
    heading: "Request received",
    intro: (name: string) =>
      `Hi ${name}, we've received your reservation request. We'll follow up as soon as it's confirmed.`,
    date: "Date",
    time: "Time",
    guests: "Guests",
    notes: "Notes",
    footer: "Questions? Just reply to this email or give us a call.",
  },
};

export default function ReservationReceivedEmail({
  locale,
  name,
  dateLabel,
  timeLabel,
  partySize,
  notes,
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

      <Text style={emailTextStyles.label}>{t.guests}</Text>
      <Text style={emailTextStyles.value}>{partySize}</Text>

      {notes && (
        <>
          <Text style={emailTextStyles.label}>{t.notes}</Text>
          <Text style={emailTextStyles.value}>{notes}</Text>
        </>
      )}

      <Text style={{ ...emailTextStyles.body, marginTop: 8 }}>{t.footer}</Text>
    </EmailLayout>
  );
}
