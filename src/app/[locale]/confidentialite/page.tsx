import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

interface PrivacySection {
  heading: string;
  body: string;
}

export async function generateMetadata({ params }: PageProps<"/[locale]/confidentialite">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/confidentialite", locale),
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/confidentialite">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacyPage");
  const sections = t.raw("sections") as PrivacySection[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} heading={t("heading")} intro={t("intro")}>
        <p className="text-xs text-ink-faint">{t("updated")}</p>
      </PageHeader>

      <Container className="max-w-2xl py-16 sm:py-20">
        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-2 border-t border-line pt-6">
              <h2 className="font-display text-xl text-ink">{section.heading}</h2>
              <p className="text-sm leading-relaxed text-ink-soft">{section.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t border-line pt-6 text-xs italic text-ink-faint">{t("disclaimer")}</p>
      </Container>
    </>
  );
}
