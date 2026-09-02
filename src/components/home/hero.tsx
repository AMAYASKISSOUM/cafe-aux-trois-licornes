import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonVariants, ButtonArrow } from "@/components/ui/button";
import { AnimatedDrawPath } from "@/components/ui/animated-draw-path";
import { RevealWords } from "@/components/ui/reveal-words";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { Magnetic } from "@/components/ui/magnetic";
import { BUSINESS } from "@/lib/business";
import { getOpenStatus, formatHour } from "@/lib/hours";
import { cn } from "@/lib/cn";

/**
 * One continuous-feeling flourish carrying the same three tapered forms as
 * `TrioMark`, scaled up into a signature moment instead of a small static
 * glyph. Anime.js draws all four paths in one staggered pass.
 */
const HERO_FLOURISH_PATHS = [
  "M2 18C24 7 38 25 58 15C74 7 84 20 100 13",
  "M114 15C118 15 113 5 117 1",
  "M130 15C134 15 128 4 133 0",
  "M146 15C150 15 144 6 149 2",
] as const;

export async function Hero() {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations("home.hero"),
    getTranslations("common"),
    getLocale(),
  ]);
  const status = getOpenStatus(BUSINESS.defaultHours);

  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-espresso">
      <HeroParallax>
        <Image
          src="/images/hero/hero-facade.jpg"
          alt={t("imageLabel")}
          fill
          priority
          sizes="100vw"
          className="animate-hero-image object-cover"
          style={{ objectPosition: "center 38%" }}
        />
      </HeroParallax>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-espresso) 95%, transparent) 0%, color-mix(in srgb, var(--color-espresso) 78%, transparent) 45%, color-mix(in srgb, var(--color-espresso) 45%, transparent) 78%, color-mix(in srgb, var(--color-espresso) 15%, transparent) 100%)",
        }}
      />
      {/*
        The gradient above thins out near the top of the section — fine over
        the sky, but the text block's actual position shifts with viewport
        height (content is bottom-aligned, but a short mobile viewport means
        the eyebrow lands higher up, over the busiest/brightest part of the
        photo — window glass, decor). A gradient alone can't guarantee
        contrast against an arbitrary photo, so the text itself carries a
        shadow as a legibility floor, independent of what's behind it.
      */}
      <Container className="relative z-10 flex flex-col gap-8 pb-16 pt-40 sm:pb-20">
        <div className="flex max-w-2xl flex-col gap-5">
          <span className="flex animate-hero-fade-up flex-col items-start gap-1.5">
            <span
              className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-soft"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.55), 0 2px 14px rgba(0,0,0,0.4)" }}
            >
              {t("eyebrow")}
            </span>
            <AnimatedDrawPath
              d={HERO_FLOURISH_PATHS}
              viewBox="0 0 152 28"
              trigger="mount"
              mountDelay={900}
              duration={900}
              staggerMs={160}
              strokeWidth={1.5}
              nonScalingStroke
              className="h-4 w-32 text-brass-soft/80 sm:h-5 sm:w-40"
            />
          </span>
          <h1
            className="font-display text-display-xl text-espresso-ink"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
          >
            <RevealWords text={t("headline")} />
          </h1>
          <p
            className="max-w-lg animate-hero-fade-up text-lg leading-relaxed text-espresso-ink-soft"
            style={{ animationDelay: "420ms", textShadow: "0 1px 10px rgba(0,0,0,0.45)" }}
          >
            {t("subtext")}
          </p>
        </div>

        <div
          className="flex animate-hero-fade-up flex-wrap items-center gap-4"
          style={{ animationDelay: "560ms" }}
        >
          <Magnetic>
            <Link href="/reservation" className={buttonVariants({})}>
              {tCommon("reserveTable")}
              <ButtonArrow />
            </Link>
          </Magnetic>
          <Link href="/menu" className={buttonVariants({ variant: "on-dark" })}>
            {tCommon("viewMenu")}
            <ButtonArrow />
          </Link>
        </div>

        <div
          className="flex animate-hero-fade-up flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-espresso-ink-soft"
          style={{ animationDelay: "680ms" }}
        >
          <a
            href={BUSINESS.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-espresso-ink"
          >
            <MapPin className="h-4 w-4" aria-hidden />
            {BUSINESS.address.street}, {BUSINESS.address.city}
          </a>
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              {status.isOpen && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-open opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-1.5 w-1.5 rounded-full",
                  status.isOpen ? "bg-open" : "bg-espresso-ink-soft"
                )}
              />
            </span>
            {status.isOpen && status.nextChangeTime
              ? `${tCommon("openNow")} · ${tCommon("closesAt", { time: formatHour(status.nextChangeTime, locale) })}`
              : status.nextChangeTime
                ? tCommon(status.nextChangeLabel === "opensTomorrow" ? "opensTomorrow" : "opensAt", {
                    time: formatHour(status.nextChangeTime, locale),
                  })
                : tCommon("closedNow")}
          </span>
        </div>
      </Container>
    </section>
  );
}
