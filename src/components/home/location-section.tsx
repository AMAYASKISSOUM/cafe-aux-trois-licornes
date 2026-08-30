import { getTranslations, getLocale } from "next-intl/server";
import { MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/business";
import { formatHour, groupWeeklyHours } from "@/lib/hours";

export async function LocationSection() {
  const [t, tCommon, tDays, locale] = await Promise.all([
    getTranslations("home.location"),
    getTranslations("common"),
    getTranslations("daysShort"),
    getLocale(),
  ]);
  const hourGroups = groupWeeklyHours(BUSINESS.defaultHours);
  const mapQuery = encodeURIComponent(
    `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}`
  );

  return (
    <section className="py-20 sm:py-28">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} />
          <p className="max-w-sm text-base leading-relaxed text-ink-soft">{t("body")}</p>

          <dl className="flex flex-col gap-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass-ink" aria-hidden />
              <dd className="text-ink-soft">
                {BUSINESS.address.street}, {BUSINESS.address.city} ({BUSINESS.address.region}){" "}
                {BUSINESS.address.postalCode}
              </dd>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brass-ink" aria-hidden />
              <dd>
                <a href={`tel:${BUSINESS.phone}`} className="text-ink-soft hover:text-ink">
                  {BUSINESS.phoneDisplay}
                </a>
              </dd>
            </div>
          </dl>

          <ul className="flex flex-col gap-1.5 border-t border-line pt-4 text-sm">
            {hourGroups.map((group, i) => (
              <li key={i} className="flex justify-between gap-4 text-ink-soft">
                <span>
                  {group.days.length > 1
                    ? `${tDays(String(group.days[0]))} – ${tDays(String(group.days[group.days.length - 1]))}`
                    : tDays(String(group.days[0]))}
                </span>
                <span className="text-ink">
                  {group.open && group.close
                    ? `${formatHour(group.open, locale)} – ${formatHour(group.close, locale)}`
                    : locale === "fr"
                      ? "Fermé"
                      : "Closed"}
                </span>
              </li>
            ))}
          </ul>

          <a
            href={BUSINESS.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary", className: "self-start" })}
          >
            {tCommon("getDirections")}
          </a>
        </div>

        <div className="min-h-[320px] overflow-hidden rounded-[var(--radius-md)] border border-line lg:min-h-full">
          <iframe
            title={t("mapTitle")}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-full min-h-[320px] w-full grayscale-[15%]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </section>
  );
}
