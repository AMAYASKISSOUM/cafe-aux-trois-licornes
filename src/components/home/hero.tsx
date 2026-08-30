import { getTranslations, getLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { BUSINESS } from "@/lib/business";
import { getOpenStatus, formatHour } from "@/lib/hours";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";

export async function Hero() {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations("home.hero"),
    getTranslations("common"),
    getLocale(),
  ]);
  const status = getOpenStatus(BUSINESS.defaultHours);

  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-espresso">
      <div className="absolute inset-0">
        <ImagePlaceholder label={t("imageLabel")} labelPosition="top" className="h-full w-full" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-espresso) 94%, transparent) 0%, color-mix(in srgb, var(--color-espresso) 60%, transparent) 40%, color-mix(in srgb, var(--color-espresso) 10%, transparent) 72%, transparent 100%)",
        }}
      />
      <Container className="relative z-10 flex flex-col gap-8 pb-16 pt-40 sm:pb-20">
        <Reveal className="flex max-w-2xl flex-col gap-5">
          <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-brass-soft">
            {t("eyebrow")}
          </span>
          <h1 className="font-display text-display-xl text-espresso-ink">{t("headline")}</h1>
          <p className="max-w-lg text-lg leading-relaxed text-espresso-ink-soft">{t("subtext")}</p>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-wrap items-center gap-4">
          <Link href="/reservation" className={buttonVariants({})}>
            {tCommon("reserveTable")}
          </Link>
          <Link href="/menu" className={buttonVariants({ variant: "on-dark" })}>
            {tCommon("viewMenu")}
          </Link>
        </Reveal>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-espresso-ink-soft">
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
            <span
              className={cn("h-1.5 w-1.5 rounded-full", status.isOpen ? "bg-open" : "bg-espresso-ink-soft")}
              aria-hidden
            />
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
