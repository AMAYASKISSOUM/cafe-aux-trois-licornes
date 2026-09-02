import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ParallaxPhoto } from "@/components/ui/parallax-photo";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { LineReveal } from "@/components/ui/line-reveal";
import { AnimatedUnderline } from "@/components/ui/animated-underline";

export async function Intro() {
  const t = await getTranslations("home.intro");

  return (
    <section className="py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="lg:order-2 lg:-mr-6 xl:-mr-10" variant="scale">
          <ParallaxPhoto
            src="/images/about/team-counter.jpg"
            alt={t("imageLabel")}
            label={t("imageLabel")}
            ratio="4/5"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>
        <RevealGroup className="flex flex-col gap-5 lg:order-1">
          <RevealItem>
            <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-ink">
              {t("eyebrow")}
            </span>
          </RevealItem>
          <RevealItem>
            <h2 className="font-display text-display-md text-ink">
              <LineReveal>
                {t.rich("heading", { mark: (chunks) => <AnimatedUnderline>{chunks}</AnimatedUnderline> })}
              </LineReveal>
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="max-w-md text-base leading-relaxed text-ink-soft">{t("body")}</p>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}
