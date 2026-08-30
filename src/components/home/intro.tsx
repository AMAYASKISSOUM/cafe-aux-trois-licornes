import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";

export async function Intro() {
  const t = await getTranslations("home.intro");

  return (
    <section className="py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="lg:order-2" variant="scale">
          <Photo
            src="/images/about/team-counter.jpg"
            alt={t("imageLabel")}
            label={t("imageLabel")}
            ratio="4/5"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>
        <Reveal className="flex flex-col gap-5 lg:order-1">
          <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-ink">
            {t("eyebrow")}
          </span>
          <h2 className="font-display text-display-md text-ink">{t("heading")}</h2>
          <p className="max-w-md text-base leading-relaxed text-ink-soft">{t("body")}</p>
        </Reveal>
      </Container>
    </section>
  );
}
