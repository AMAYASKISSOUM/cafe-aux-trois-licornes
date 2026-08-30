import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { getReviewSummary } from "@/lib/google-reviews";
import { BUSINESS } from "@/lib/business";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

export async function ReviewsSection() {
  const t = await getTranslations("home.reviews");
  const { reviews, rating, count } = await getReviewSummary(6);

  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} className="max-w-lg" />
          {rating && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 text-brass" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    fill={i < Math.round(rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="text-sm text-ink-soft">
                <span className="font-medium text-ink">{rating.toFixed(1)}</span> {t("ratingSuffix")}
                {count ? ` · ${count} ${t("reviewsSuffix")}` : ""}
              </p>
            </div>
          )}
        </div>

        <RevealGroup className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review, i) => (
            <RevealItem key={i}>
              <figure className="flex h-full flex-col gap-4 border-t border-line pt-6">
                <blockquote className="font-display text-lg leading-snug text-ink">
                  “{review.quote}”
                </blockquote>
                <figcaption className="text-sm text-ink-faint">
                  {review.author} · {review.approxDate}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>

        <a
          href={BUSINESS.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brass-ink underline decoration-brass/40 underline-offset-4 hover:decoration-brass-ink"
        >
          {t("viewOnGoogle")}
        </a>
      </Container>
    </section>
  );
}
