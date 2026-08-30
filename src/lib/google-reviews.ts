import { STATIC_REVIEWS, type StaticReview } from "@/lib/reviews";
import { BUSINESS } from "@/lib/business";

export interface ReviewSummary {
  reviews: StaticReview[];
  rating: number | undefined;
  count: number | undefined;
  source: "google-live" | "static";
}

interface GooglePlaceReview {
  text?: { text?: string };
  authorAttribution?: { displayName?: string };
  relativePublishTimeDescription?: string;
}

interface GooglePlaceResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: GooglePlaceReview[];
}

/**
 * Live Google Places (New) adapter, gated on GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID.
 * Falls back to the verified static excerpts whenever either is unset or the
 * request fails, so a missing/invalid key never breaks the page.
 */
export async function getReviewSummary(limit?: number): Promise<ReviewSummary> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (apiKey && placeId) {
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount,reviews`,
        {
          headers: { "X-Goog-Api-Key": apiKey },
          next: { revalidate: 3600 },
        }
      );
      if (res.ok) {
        const data = (await res.json()) as GooglePlaceResponse;
        const reviews: StaticReview[] = (data.reviews ?? [])
          .filter((r): r is GooglePlaceReview & { text: { text: string } } => Boolean(r.text?.text))
          .map((r) => ({
            quote: r.text.text,
            author: r.authorAttribution?.displayName ?? "Google User",
            approxDate: r.relativePublishTimeDescription ?? "",
          }));
        return {
          reviews: limit ? reviews.slice(0, limit) : reviews,
          rating: data.rating ?? BUSINESS.rating.value,
          count: data.userRatingCount ?? BUSINESS.rating.count,
          source: "google-live",
        };
      }
    } catch {
      // network/API failure — fall through to the static fallback below
    }
  }

  return {
    reviews: limit ? STATIC_REVIEWS.slice(0, limit) : STATIC_REVIEWS,
    rating: BUSINESS.rating.value,
    count: BUSINESS.rating.count,
    source: "static",
  };
}
