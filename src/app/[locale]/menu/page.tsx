import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { buildAlternates } from "@/lib/seo";
import { buildMenuJsonLd } from "@/lib/structured-data";
import { getMenu, formatPrice, normalizeSearch } from "@/lib/menu";
import { localized } from "@/lib/i18n-utils";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { MenuSearchForm } from "@/components/menu/menu-search-form";
import { CategoryNav } from "@/components/menu/category-nav";

export async function generateMetadata({ params }: PageProps<"/[locale]/menu">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "menuPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/menu", locale),
  };
}

export default async function MenuPage({ params, searchParams }: PageProps<"/[locale]/menu">) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("menuPage");
  const rawQuery = resolvedSearchParams?.q;
  const query = typeof rawQuery === "string" ? rawQuery : "";
  const categories = await getMenu();

  const normalizedQuery = normalizeSearch(query);
  const filtered = normalizedQuery
    ? categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => {
            const haystack = [
              localized(item.name, locale),
              item.description ? localized(item.description, locale) : "",
            ]
              .join(" ")
              .toLowerCase();
            return normalizeSearch(haystack).includes(normalizedQuery);
          }),
        }))
        .filter((category) => category.items.length > 0)
    : categories;

  const totalResults = filtered.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildMenuJsonLd(locale)) }}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        heading={t("heading")}
        intro={t("intro")}
        image={{ src: "/images/menu/counter-board.jpg", alt: t("coverImageAlt") }}
      >
        <MenuSearchForm
          label={t("searchLabel")}
          placeholder={t("searchPlaceholder")}
          defaultValue={query}
        />
      </PageHeader>

      <Container className="py-12 sm:py-16">
        {!normalizedQuery && (
          <div className="sticky top-[4.5rem] z-30 -mt-2 mb-10 bg-parchment/95 py-3 backdrop-blur-sm sm:top-20">
            <CategoryNav categories={categories} locale={locale} />
          </div>
        )}

        {normalizedQuery && (
          <p className="mb-8 text-sm text-ink-faint" aria-live="polite">
            {t("resultsCount", { count: totalResults })}
          </p>
        )}

        {totalResults === 0 ? (
          <p className="py-16 text-center text-ink-soft">{t("noResults", { query })}</p>
        ) : (
          <div className="flex flex-col gap-16">
            {filtered.map((category) => (
              <section key={category.slug} id={category.slug} className="scroll-mt-32">
                <h2 className="font-display text-2xl text-ink">{localized(category.name, locale)}</h2>
                <ul className="mt-6 flex flex-col divide-y divide-line border-t border-line">
                  {category.items.map((item) => (
                    <li key={item.slug} className="flex items-start justify-between gap-6 py-5">
                      <div className="flex flex-col gap-1">
                        <h3 className="flex items-center gap-2 font-display text-lg text-ink">
                          {localized(item.name, locale)}
                          {item.featured && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-brass-ink">
                              <Star className="h-3 w-3" fill="currentColor" aria-hidden />
                              {t("popular")}
                            </span>
                          )}
                        </h3>
                        {item.description && (
                          <p className="max-w-md text-sm leading-relaxed text-ink-soft">
                            {localized(item.description, locale)}
                          </p>
                        )}
                      </div>
                      <span className="whitespace-nowrap pt-1 font-medium text-ink">
                        {formatPrice(item.price, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="mt-16 max-w-lg text-xs text-ink-faint">{t("priceNote")}</p>
      </Container>
    </>
  );
}
