import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/menu": "/menu",
    "/a-propos": {
      fr: "/a-propos",
      en: "/about",
    },
    "/galerie": {
      fr: "/galerie",
      en: "/gallery",
    },
    "/avis": {
      fr: "/avis",
      en: "/reviews",
    },
    "/reservation": "/reservation",
    "/contact": "/contact",
    "/confidentialite": {
      fr: "/confidentialite",
      en: "/privacy",
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
