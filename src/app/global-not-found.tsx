import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Fraunces, Work_Sans } from "next/font/google";
import { TrioMark } from "@/components/ui/mark";
import { NAV_ITEMS } from "@/lib/nav";
import { BUSINESS } from "@/lib/business";
import "./globals.css";

// global-not-found.js bypasses the [locale] layout entirely (this app's root
// layout is a dynamic segment, the exact case Next's docs call out this file
// for), so it needs its own fonts/styles and can't use next-intl — reads the
// locale cookie the proxy already sets, since that's still available here.

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", display: "swap" });

export const metadata: Metadata = {
  title: `404 — ${BUSINESS.name}`,
  description: "Page introuvable / Page not found.",
};

const COPY = {
  fr: {
    eyebrow: "Erreur 404",
    heading: "Cette page s'est égarée",
    body: "La page que vous cherchez n'existe pas ou a été déplacée.",
    home: "Accueil",
    menu: "Menu",
    labels: { menu: "Menu", about: "À propos", gallery: "Galerie", reviews: "Avis", contact: "Contact" },
  },
  en: {
    eyebrow: "404 error",
    heading: "This page wandered off",
    body: "The page you're looking for doesn't exist or has moved.",
    home: "Home",
    menu: "Menu",
    labels: { menu: "Menu", about: "About", gallery: "Gallery", reviews: "Reviews", contact: "Contact" },
  },
};

const EN_PATHS: Record<string, string> = {
  "/menu": "/en/menu",
  "/a-propos": "/en/about",
  "/galerie": "/en/gallery",
  "/avis": "/en/reviews",
  "/contact": "/en/contact",
};

export default async function GlobalNotFound() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value === "en" ? "en" : "fr";
  const t = COPY[locale];
  const homeHref = locale === "en" ? "/en" : "/";

  return (
    <html lang={locale} className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-6 bg-parchment px-6 py-24 text-center font-sans text-ink">
        <TrioMark className="h-6 w-9 text-brass" />
        <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-ink">
          {t.eyebrow}
        </span>
        <h1 className="font-display text-display-lg text-ink">{t.heading}</h1>
        <p className="max-w-md text-base leading-relaxed text-ink-soft">{t.body}</p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={homeHref}
            className="inline-flex h-12 items-center justify-center rounded-[4px] bg-petrol px-6 text-[0.9375rem] font-medium text-parchment hover:bg-petrol-deep"
          >
            {t.home}
          </a>
          <a
            href={locale === "en" ? "/en/menu" : "/menu"}
            className="inline-flex h-12 items-center justify-center rounded-[4px] border border-ink/25 px-6 text-[0.9375rem] font-medium text-ink hover:border-ink"
          >
            {t.menu}
          </a>
        </div>

        <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {NAV_ITEMS.filter((item) => item.href !== "/menu").map((item) => (
            <a
              key={item.href}
              href={locale === "en" ? EN_PATHS[item.href] : item.href}
              className="text-ink-soft hover:text-ink"
            >
              {t.labels[item.labelKey as keyof typeof t.labels] ?? item.labelKey}
            </a>
          ))}
        </nav>
      </body>
    </html>
  );
}
