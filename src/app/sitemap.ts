import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/site";
import type { AppPathname } from "@/i18n/routing";

const PATHS: AppPathname[] = [
  "/",
  "/menu",
  "/a-propos",
  "/galerie",
  "/avis",
  "/reservation",
  "/contact",
  "/confidentialite",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: new URL(getPathname({ locale: routing.defaultLocale, href: path }), SITE_URL).toString(),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, new URL(getPathname({ locale: l, href: path }), SITE_URL).toString()])
      ),
    },
  }));
}
