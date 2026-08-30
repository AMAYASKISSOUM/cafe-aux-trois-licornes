import { z } from "zod";

const MESSAGES = {
  fr: {
    date: "Date invalide",
    time: "Heure invalide",
    partyMin: "Minimum 1 personne",
    partyMax: (max: number) => `Maximum ${max} personnes`,
    nameMin: "Nom trop court",
    nameMax: "Nom trop long",
    email: "Courriel invalide",
    phone: "Numéro de téléphone invalide",
    notesMax: "500 caractères maximum",
    consent: "Le consentement est requis.",
  },
  en: {
    date: "Invalid date",
    time: "Invalid time",
    partyMin: "Minimum 1 guest",
    partyMax: (max: number) => `Maximum ${max} guests`,
    nameMin: "Name is too short",
    nameMax: "Name is too long",
    email: "Invalid email",
    phone: "Invalid phone number",
    notesMax: "500 characters maximum",
    consent: "Consent is required.",
  },
};

export function buildReservationSchema(maxPartySize: number, locale: "fr" | "en" = "fr") {
  const t = MESSAGES[locale];
  return z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t.date),
    time: z.string().regex(/^\d{2}:\d{2}$/, t.time),
    partySize: z.coerce.number().int().min(1, t.partyMin).max(maxPartySize, t.partyMax(maxPartySize)),
    fullName: z.string().trim().min(2, t.nameMin).max(100, t.nameMax),
    email: z.string().trim().toLowerCase().email(t.email),
    phone: z.string().trim().min(7, t.phone).max(20, t.phone),
    notes: z.string().trim().max(500, t.notesMax).optional().or(z.literal("")),
    consent: z.boolean().refine((v) => v === true, t.consent),
    // Honeypot: real users never fill this hidden field.
    company: z.string().max(0).optional().or(z.literal("")),
  });
}

export type ReservationInput = z.infer<ReturnType<typeof buildReservationSchema>>;
