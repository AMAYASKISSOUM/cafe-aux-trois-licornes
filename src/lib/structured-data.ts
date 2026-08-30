import { BUSINESS } from "@/lib/business";
import { SITE_URL } from "@/lib/site";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/lib/menu-data";
import { localized } from "@/lib/i18n-utils";

const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
].map((d) => `https://schema.org/${d}`);

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: BUSINESS.name,
    url: SITE_URL,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    aggregateRating: BUSINESS.rating.value
      ? {
          "@type": "AggregateRating",
          ratingValue: BUSINESS.rating.value,
          reviewCount: BUSINESS.rating.count,
        }
      : undefined,
    openingHoursSpecification: BUSINESS.defaultHours
      .filter((h) => h.open && h.close)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SCHEMA_DAYS[h.day],
        opens: h.open,
        closes: h.close,
      })),
    sameAs: [BUSINESS.socials.facebook, BUSINESS.socials.instagram].filter(Boolean),
    menu: `${SITE_URL}/menu`,
  };
}

export function buildMenuJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    url: `${SITE_URL}/menu`,
    hasMenuSection: MENU_CATEGORIES.map((cat) => ({
      "@type": "MenuSection",
      name: localized(cat.name, locale),
      hasMenuItem: MENU_ITEMS.filter((i) => i.category === cat.slug).map((item) => ({
        "@type": "MenuItem",
        name: localized(item.name, locale),
        description: item.description ? localized(item.description, locale) : undefined,
        offers: {
          "@type": "Offer",
          price: item.price.toFixed(2),
          priceCurrency: "CAD",
        },
      })),
    })),
  };
}
