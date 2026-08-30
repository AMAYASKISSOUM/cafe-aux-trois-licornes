import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { BUSINESS } from "@/lib/business";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionProvider } from "@/components/motion-provider";
import { buildLocalBusinessJsonLd } from "@/lib/structured-data";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("defaultTitle"),
      template: t("template"),
    },
    description: t("description"),
    openGraph: {
      siteName: BUSINESS.name,
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-clip bg-parchment font-sans text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessJsonLd()) }}
        />
        <NextIntlClientProvider>
          <MotionProvider>
            <a
              href="#main"
              className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-[var(--radius-sm)] focus-visible:bg-ink focus-visible:px-4 focus-visible:py-2 focus-visible:text-parchment"
            >
              {await getSkipLabel(locale)}
            </a>
            <SiteHeader />
            <main id="main" className="flex flex-1 flex-col">
              {children}
            </main>
            <SiteFooter />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

async function getSkipLabel(locale: string) {
  const t = await getTranslations({ locale, namespace: "common" });
  return t("skipToContent");
}
