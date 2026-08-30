import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

/** Builds `alternates` (canonical + hreflang) for a page, from its shared pathname key. */
export function buildAlternates(pathname: AppPathname, locale: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = new URL(getPathname({ locale: l, href: pathname }), SITE_URL).toString();
  }
  languages["x-default"] = languages[routing.defaultLocale];

  return {
    canonical: new URL(getPathname({ locale: locale as (typeof routing.locales)[number], href: pathname }), SITE_URL).toString(),
    languages,
  };
}
