/**
 * Verified Google review excerpts (verbatim, under 15 words, attributed).
 * Source: Google Maps listing reviews tab — see docs/BUSINESS_RESEARCH.md.
 * This is the static fallback used when the Google Places API is not
 * configured; see src/lib/google-reviews.ts for the live adapter.
 */

export interface StaticReview {
  quote: string;
  author: string;
  approxDate: string;
  isLocalGuide?: boolean;
  reviewCount?: number;
}

export const STATIC_REVIEWS: StaticReview[] = [
  {
    quote: "Meilleur cappuccino que j'ai bu depuis longtemps!",
    author: "K. D.",
    approxDate: "il y a ~5 mois",
    isLocalGuide: true,
    reviewCount: 115,
  },
  {
    quote: "L'endroit est tellement cosy! Des chaises dépareillées, des sofas…",
    author: "Annabel Brunet-Beaudry",
    approxDate: "il y a ~3 mois",
    isLocalGuide: true,
    reviewCount: 88,
  },
  {
    quote: "…un petit coin de magie en pleine ville.",
    author: "Bianka Beaudoin-Carriere",
    approxDate: "il y a ~4 mois",
    isLocalGuide: true,
    reviewCount: 22,
  },
  {
    quote: "…le service, la cuisine et l'ambiance sont uniques et parfaits!",
    author: "Samantha Bisson",
    approxDate: "il y a ~4 mois",
    isLocalGuide: true,
    reviewCount: 23,
  },
  {
    quote: "…l'ambiance vieillot-actuel, qui rend…nostalgique et confortable.",
    author: "Marie-Chantal Perron",
    approxDate: "il y a ~6 mois",
    isLocalGuide: true,
    reviewCount: 59,
  },
  {
    quote: "Le lieu est superbement décoré, ambiance vintage.",
    author: "Hélène Cartier",
    approxDate: "il y a ~2 mois",
    reviewCount: 5,
  },
  {
    quote: "Belle ambiance, arrangé avec goût.",
    author: "Isabelle Chartrand",
    approxDate: "il y a ~4 mois",
    reviewCount: 6,
  },
  {
    quote: "Le grilled cheese trois fromage a coupé le souffle.",
    author: "Julie",
    approxDate: "il y a ~4 mois",
    isLocalGuide: true,
    reviewCount: 20,
  },
  {
    quote: "Leur latte est débile et les sandwichs sont 👌🏼👌🏼",
    author: "Melissa",
    approxDate: "il y a ~2 mois",
    isLocalGuide: true,
    reviewCount: 40,
  },
];
