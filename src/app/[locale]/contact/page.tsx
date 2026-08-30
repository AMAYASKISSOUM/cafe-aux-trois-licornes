import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone, ParkingSquare } from "lucide-react";
import { buildAlternates } from "@/lib/seo";
import { BUSINESS } from "@/lib/business";
import { formatHour, groupWeeklyHours } from "@/lib/hours";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/contact", locale),
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tCommon, tDays] = await Promise.all([
    getTranslations("contactPage"),
    getTranslations("common"),
    getTranslations("daysShort"),
  ]);
  const hourGroups = groupWeeklyHours(BUSINESS.defaultHours);
  const mapQuery = encodeURIComponent(
    `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}`
  );

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} heading={t("heading")} intro={t("intro")} />

      <Container className="grid grid-cols-1 gap-14 py-16 sm:py-20 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div className="flex flex-col gap-10">
          <dl className="flex flex-col gap-6">
            <div className="flex items-start gap-3.5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-petrol-ink" aria-hidden />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">{t("addressLabel")}</dt>
                <dd className="mt-1 text-ink-soft">
                  <a href={BUSINESS.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                    {BUSINESS.address.street}
                    <br />
                    {BUSINESS.address.city} ({BUSINESS.address.region}) {BUSINESS.address.postalCode}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-petrol-ink" aria-hidden />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">{t("phoneLabel")}</dt>
                <dd className="mt-1">
                  <a href={`tel:${BUSINESS.phone}`} className="text-ink-soft hover:text-ink">
                    {BUSINESS.phoneDisplay}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-petrol-ink" aria-hidden />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">{t("emailLabel")}</dt>
                <dd className="mt-1">
                  <a href={`mailto:${BUSINESS.email}`} className="text-ink-soft hover:text-ink">
                    {BUSINESS.email}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <ParkingSquare className="mt-0.5 h-5 w-5 shrink-0 text-petrol-ink" aria-hidden />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">{t("parkingLabel")}</dt>
                <dd className="mt-1 text-ink-soft">{t("parkingBody")}</dd>
              </div>
            </div>
          </dl>

          <div className="border-t border-line pt-6">
            <h2 className="text-xs font-medium uppercase tracking-wide text-ink-faint">{t("hoursLabel")}</h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
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
          </div>

          <a
            href={BUSINESS.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ className: "self-start" })}
          >
            {tCommon("getDirections")}
          </a>
        </div>

        <div className="min-h-[400px] overflow-hidden rounded-[var(--radius-md)] border border-line">
          <iframe
            title={t("mapTitle")}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-full min-h-[400px] w-full grayscale-[15%]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </>
  );
}
