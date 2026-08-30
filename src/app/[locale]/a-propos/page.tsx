import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Photo } from "@/components/ui/photo";
import { buttonVariants } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

interface Value {
  title: string;
  body: string;
}

export async function generateMetadata({ params }: PageProps<"/[locale]/a-propos">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/a-propos", locale),
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/a-propos">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tCommon] = await Promise.all([
    getTranslations("aboutPage"),
    getTranslations("common"),
  ]);
  const values = t.raw("values") as Value[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} heading={t("heading")} intro={t("intro")} />

      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="scale">
            <Photo
              src="/images/about/piano-corner.jpg"
              alt={t("storyImageLabel")}
              label={t("storyImageLabel")}
              ratio="4/5"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Reveal>
          <Reveal variant="slide-right" delay={0.15} className="flex flex-col gap-5">
            <h2 className="font-display text-display-md text-ink">{t("storyHeading")}</h2>
            <p className="max-w-md text-base leading-relaxed text-ink-soft">{t("storyBody1")}</p>
            <p className="max-w-md text-base leading-relaxed text-ink-soft">{t("storyBody2")}</p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-parchment-deep py-20 sm:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal delay={0.1} className="flex flex-col gap-3 lg:order-2">
            <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-ink">
              {t("founderLabel")}
            </span>
            <h2 className="font-display text-2xl text-ink">{t("founderName")}</h2>
            <p className="max-w-sm text-base leading-relaxed text-ink-soft">{t("founderBody")}</p>
          </Reveal>
          <Reveal variant="scale" className="lg:order-1">
            <Photo
              alt={t("founderImageLabel")}
              label={t("founderImageLabel")}
              ratio="1/1"
              className="mx-auto w-full max-w-sm"
              sizes="(min-width: 640px) 384px, 100vw"
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="flex flex-col gap-14">
          <Reveal>
            <h2 className="max-w-md font-display text-display-md text-ink">{t("valuesHeading")}</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:divide-x sm:divide-line">
            {values.map((value) => (
              <RevealItem key={value.title} className="flex flex-col gap-3 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <h3 className="font-display text-lg text-ink">{value.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{value.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="flex flex-wrap gap-4">
            <Link href="/menu" className={buttonVariants({ variant: "secondary" })}>
              {tCommon("viewMenu")}
            </Link>
            <Link href="/reservation" className={buttonVariants({})}>
              {tCommon("reserveTable")}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
