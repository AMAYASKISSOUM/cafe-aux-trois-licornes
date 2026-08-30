import { getTranslations, getLocale } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/layout/wordmark";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { FacebookIcon, InstagramIcon } from "@/components/ui/social-icons";
import { NAV_ITEMS } from "@/lib/nav";
import { BUSINESS } from "@/lib/business";
import { formatHour, groupWeeklyHours } from "@/lib/hours";

export async function SiteFooter() {
  const [t, tDays, locale] = await Promise.all([
    getTranslations("footer"),
    getTranslations("daysShort"),
    getLocale(),
  ]);
  const tNav = await getTranslations("nav");
  const hourGroups = groupWeeklyHours(BUSINESS.defaultHours);

  return (
    <footer className="bg-espresso text-espresso-ink">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:py-20">
        <div className="flex flex-col gap-5">
          <Wordmark dark size="lg" />
          <p className="max-w-xs text-sm leading-relaxed text-espresso-ink-soft">
            {t("tagline")}
          </p>
          <div className="mt-2 flex items-center gap-4">
            {BUSINESS.socials.facebook && (
              <a
                href={BUSINESS.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-espresso-ink-soft transition-colors hover:text-espresso-ink"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
            {BUSINESS.socials.instagram && (
              <a
                href={BUSINESS.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-espresso-ink-soft transition-colors hover:text-espresso-ink"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <nav aria-label={t("navTitle")} className="flex flex-col gap-3">
          <h2 className="text-eyebrow font-medium uppercase text-espresso-ink-soft">
            {t("navTitle")}
          </h2>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-espresso-ink-soft transition-colors hover:text-espresso-ink"
            >
              {tNav(item.labelKey)}
            </Link>
          ))}
          <Link
            href="/reservation"
            className="text-sm text-espresso-ink-soft transition-colors hover:text-espresso-ink"
          >
            {tNav("reserve")}
          </Link>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-eyebrow font-medium uppercase text-espresso-ink-soft">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {t("hoursTitle")}
          </h2>
          <ul className="flex flex-col gap-1.5 text-sm text-espresso-ink-soft">
            {hourGroups.map((group, i) => (
              <li key={i} className="flex justify-between gap-4">
                <span>
                  {group.days.length > 1
                    ? `${tDays(String(group.days[0]))} – ${tDays(String(group.days[group.days.length - 1]))}`
                    : tDays(String(group.days[0]))}
                </span>
                <span className="text-espresso-ink">
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

        <div className="flex flex-col gap-3">
          <h2 className="text-eyebrow font-medium uppercase text-espresso-ink-soft">
            {t("infoTitle")}
          </h2>
          <a
            href={BUSINESS.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 text-sm text-espresso-ink-soft transition-colors hover:text-espresso-ink"
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.city} ({BUSINESS.address.region}) {BUSINESS.address.postalCode}
            </span>
          </a>
          <a
            href={`tel:${BUSINESS.phone}`}
            className="flex items-center gap-2.5 text-sm text-espresso-ink-soft transition-colors hover:text-espresso-ink"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            {BUSINESS.phoneDisplay}
          </a>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="flex items-center gap-2.5 text-sm text-espresso-ink-soft transition-colors hover:text-espresso-ink"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            {BUSINESS.email}
          </a>
        </div>
      </Container>

      <div className="border-t border-line-on-dark">
        <Container className="flex flex-col-reverse items-center gap-4 py-6 text-xs text-espresso-ink-soft sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BUSINESS.name} — {t("rights")}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/confidentialite" className="hover:text-espresso-ink">
              {t("privacy")}
            </Link>
            <LanguageSwitch dark />
          </div>
        </Container>
      </div>
    </footer>
  );
}
