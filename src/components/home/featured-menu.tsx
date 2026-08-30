import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Photo } from "@/components/ui/photo";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedMenuItems, formatPrice } from "@/lib/menu";
import { localized } from "@/lib/i18n-utils";
import { Reveal } from "@/components/ui/reveal";

export async function FeaturedMenu() {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations("home.featuredMenu"),
    getTranslations("common"),
    getLocale(),
  ]);
  const items = await getFeaturedMenuItems(6);

  return (
    <section className="bg-parchment-deep py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} className="max-w-lg" />
          <Link href="/menu" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            {tCommon("seeFullMenu")}
          </Link>
        </div>

        <Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {items.map((item) => {
              const name = localized(item.name, locale);
              return (
                <li key={item.slug} className="flex flex-col gap-3">
                  <Photo alt={name} label={name} ratio="1/1" />
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-display text-base leading-tight text-ink">{name}</h3>
                    <p className="text-sm font-medium text-brass-ink">{formatPrice(item.price, locale)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
