import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { getReservationPolicy } from "@/lib/settings-service";
import { todayKey, dateKeyPlusDays } from "@/lib/availability";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ReservationForm } from "@/components/reservation/reservation-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/reservation">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reservationPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/reservation", locale),
  };
}

export const dynamic = "force-dynamic";

export default async function ReservationPage({ params }: PageProps<"/[locale]/reservation">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservationPage");
  const policy = await getReservationPolicy();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} heading={t("heading")} intro={t("intro")} />
      <Container className="max-w-2xl py-16 sm:py-20">
        <ReservationForm
          locale={locale as "fr" | "en"}
          today={todayKey()}
          maxDate={dateKeyPlusDays(policy.maxAdvanceDays)}
          initialMaxPartySize={policy.maxPartySize}
        />
      </Container>
    </>
  );
}
