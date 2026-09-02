import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonVariants, ButtonArrow } from "@/components/ui/button";
import { AnimatedTrioMark } from "@/components/ui/trio-mark-animated";
import { AnimatedDrawPath } from "@/components/ui/animated-draw-path";
import { Magnetic } from "@/components/ui/magnetic";
import { TextReveal } from "@/components/ui/text-reveal";
import { Reveal } from "@/components/ui/reveal";

export async function ReservationCta() {
  const [t, tCommon] = await Promise.all([
    getTranslations("home.reservationCta"),
    getTranslations("common"),
  ]);

  return (
    <section className="relative overflow-hidden bg-espresso py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 text-brass/[0.13]"
      >
        <AnimatedTrioMark className="h-72 w-96" />
      </div>
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Reveal className="flex flex-col items-center gap-6">
          <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-soft">
            {t("eyebrow")}
          </span>
          <h2 className="font-display text-display-lg text-espresso-ink">
            <TextReveal text={t("heading")} />
          </h2>
          <p className="max-w-md text-base leading-relaxed text-espresso-ink-soft">{t("body")}</p>
          <Magnetic className="relative mt-2 inline-block">
            <span aria-hidden className="pointer-events-none absolute -inset-3 text-brass-soft/50">
              <AnimatedDrawPath
                d="M1 1H99V99H1Z"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                nonScalingStroke
                strokeWidth={1}
                duration={900}
                className="h-full w-full"
              />
            </span>
            <Link href="/reservation" className={buttonVariants({})}>
              {tCommon("reserveTable")}
              <ButtonArrow />
            </Link>
          </Magnetic>
        </Reveal>
      </Container>
    </section>
  );
}
