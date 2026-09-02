import { Star, Quote } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { getReviewSummary } from "@/lib/google-reviews";
import { BUSINESS } from "@/lib/business";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { ReviewsMobileStrip } from "@/components/home/reviews-mobile-strip";
import { SlideText } from "@/components/ui/slide-text";

export async function ReviewsSection() {
  const t = await getTranslations("home.reviews");
  const { reviews, rating, count } = await getReviewSummary(7);
  const [featured, ...rest] = reviews;

  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
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
        </Reveal>

        {featured && (
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-20 bg-parchment-deep/70"
              style={{ transform: "rotate(-2.5deg)" }}
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-parchment-deep"
              style={{ transform: "rotate(1.75deg)" }}
            />
            <Reveal variant="card">
              <figure className="relative flex flex-col gap-5 overflow-hidden bg-petrol-tint px-7 py-9 sm:px-10 sm:py-11">
                <Quote className="h-8 w-8 text-petrol-soft" aria-hidden />
                <blockquote className="max-w-2xl font-display text-2xl leading-snug text-petrol-deep sm:text-3xl">
                  “{featured.quote}”
                </blockquote>
                <figcaption className="text-sm font-medium text-petrol-ink">
                  {featured.author} · {featured.approxDate}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        )}

        <ReviewsMobileStrip reviews={rest} />

        {/* Desktop: staggered grid */}
        <RevealGroup className="hidden grid-cols-1 gap-x-10 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((review, i) => (
            <RevealItem key={i} variant="card">
              <figure className="flex h-full flex-col gap-4 border-t border-line pt-6 transition-colors duration-300 hover:border-petrol/40">
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
          <SlideText text={t("viewOnGoogle")} />
        </a>
      </Container>
    </section>
  );
}
