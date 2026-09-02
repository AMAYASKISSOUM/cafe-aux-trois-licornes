"use client";

import type { StaticReview } from "@/lib/reviews";
import { useSnapIndex } from "@/components/ui/use-snap-index";
import { cn } from "@/lib/cn";

/** Horizontal swipeable review cards for mobile, with an active-dot indicator tied to real scroll position. */
export function ReviewsMobileStrip({ reviews }: { reviews: StaticReview[] }) {
  const { ref: stripRef, onScroll: handleStripScroll, index: stripIndex } = useSnapIndex();

  return (
    <div className="sm:hidden">
      <div
        ref={stripRef}
        onScroll={handleStripScroll}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2"
      >
        {reviews.map((review, i) => (
          <figure
            key={i}
            className="flex w-[78vw] flex-none snap-start flex-col gap-4 border-t border-line pt-6 active:opacity-70"
          >
            <blockquote className="font-display text-lg leading-snug text-ink">“{review.quote}”</blockquote>
            <figcaption className="text-sm text-ink-faint">
              {review.author} · {review.approxDate}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
        {reviews.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 ease-[var(--ease-editorial)]",
              i === stripIndex ? "w-5 bg-petrol" : "w-1.5 bg-ink-faint/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
