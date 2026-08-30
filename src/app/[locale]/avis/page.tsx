import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { buildAlternates } from "@/lib/seo";
import { getReviewSummary } from "@/lib/google-reviews";
import { BUSINESS } from "@/lib/business";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export async function generateMetadata({ params }: PageProps<"/[locale]/avis">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviewsPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/avis", locale),
  };
}

export default async function ReviewsPage({ params }: PageProps<"/[locale]/avis">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reviewsPage");
  const { reviews, rating, count } = await getReviewSummary();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} heading={t("heading")} intro={t("intro")}>
        {rating && (
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-0.5 text-brass" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5" fill={i < Math.round(rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <p className="text-sm text-ink-soft">
              <span className="font-medium text-ink">{rating.toFixed(1)}</span> {t("ratingSuffix")}
              {count ? ` · ${count} ${t("reviewsSuffix")}` : ""}
            </p>
          </div>
        )}
      </PageHeader>

      <Container className="py-16 sm:py-20">
        <div className="columns-1 gap-x-10 sm:columns-2">
          {reviews.map((review, i) => (
            <figure key={i} className="mb-10 flex break-inside-avoid flex-col gap-4 border-t border-line pt-6">
              <blockquote className="font-display text-xl leading-snug text-ink">“{review.quote}”</blockquote>
              <figcaption className="text-sm text-ink-faint">
                {review.author} · {review.approxDate}
                {review.isLocalGuide && ` · Local Guide${review.reviewCount ? ` (${review.reviewCount})` : ""}`}
              </figcaption>
            </figure>
          ))}
        </div>

        <a
          href={BUSINESS.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-sm font-medium text-brass-ink underline decoration-brass/40 underline-offset-4 hover:decoration-brass-ink"
        >
          {t("viewOnGoogle")}
        </a>
      </Container>
    </>
  );
}
