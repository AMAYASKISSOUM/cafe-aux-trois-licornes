/**
 * Single source of truth for verified Café Aux Trois Licornes business facts.
 * Sourced from docs/BUSINESS_RESEARCH.md — never invent values here.
 * The database (business_settings / opening_hours) is the runtime source of
 * truth once seeded; this module is also the seed input and the fallback
 * used anywhere the DB is unavailable (build time, demo mode).
 */

export const TIMEZONE = "America/Toronto";

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export interface DayHours {
  day: WeekdayIndex;
  /** null when closed all day */
  open: string | null; // "HH:mm" 24h
  close: string | null; // "HH:mm" 24h
}

export const BUSINESS = {
  name: "Café Aux Trois Licornes",
  legalName: "Café Aux Trois Licornes",
  tagline: {
    fr: "Café espace ludique",
    en: "A café built for play",
  },

  description: {
    fr: "Un café-espace ludique à Gatineau : espresso soigné, cuisine maison et jeux de société, dans un décor vintage chiné pièce par pièce.",
    en: "A café built for play in Gatineau: carefully made espresso, home-style cooking and board games, in a warm room furnished piece by piece with vintage finds.",
  },

  address: {
    street: "335 Boul. Saint-Joseph",
    city: "Gatineau",
    region: "QC",
    postalCode: "J8Y 3Z2",
    country: "CA",
    countryName: "Canada",
  },

  phone: "+18192056622",
  phoneDisplay: "(819) 205-6622",
  email: "info@troislicornes.com",

  websiteUrl: "https://www.cafetroislicornes.com/",
  googleMapsUrl:
    "https://www.google.com/maps/place/Caf%C3%A9+Aux+Trois+Licornes/@45.4414806,-75.7330823,17z",
  googleMapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=335+Boul+Saint-Joseph+Gatineau+QC+J8Y+3Z2",
  googleKnowledgeGraphId: "/g/11xdt03t5h",

  geo: {
    latitude: 45.4414806,
    longitude: -75.7330823,
  },

  socials: {
    facebook: "https://www.facebook.com/p/Caf%C3%A9-Aux-Trois-Licornes-61575607242869/",
    instagram: "https://www.instagram.com/cafeauxtroislicornes/",
  },

  rating: {
    value: 4.6,
    count: 100,
  },

  /**
   * Owner-stated hours (website homepage + booking page, both consistent).
   * Google Maps shows Thursday open to midnight instead of 17:00 — possibly
   * a recurring game night that was never added to the website. Using the
   * website's consistent version until the owner confirms; see
   * docs/BUSINESS_RESEARCH.md Section 3.
   */
  defaultHours: [
    { day: 0, open: "08:00", close: "16:00" }, // Sunday
    { day: 1, open: "07:30", close: "17:00" }, // Monday
    { day: 2, open: "07:30", close: "17:00" }, // Tuesday
    { day: 3, open: "07:30", close: "17:00" }, // Wednesday
    { day: 4, open: "07:30", close: "17:00" }, // Thursday
    { day: 5, open: "07:30", close: "17:00" }, // Friday
    { day: 6, open: "08:00", close: "17:00" }, // Saturday
  ] satisfies DayHours[],

  priceRange: "$$" as const,
  categories: ["Café", "Coffee shop"] as const,

  amenities: {
    dineIn: true,
    takeout: true,
    delivery: true,
    freeParking: true,
    freeStreetParking: true,
    wheelchairAccessibleParking: true,
  },

  foundedYear: 2025,
} as const;

export type Business = typeof BUSINESS;
