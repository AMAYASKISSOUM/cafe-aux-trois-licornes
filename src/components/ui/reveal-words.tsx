import { Fragment } from "react";
import { cn } from "@/lib/cn";

/**
 * Word-level mask reveal for above-the-fold headings (Hero, PageHeader).
 * Plain CSS animation (`.animate-hero-line` in globals.css), deliberately not
 * `motion` — this text is the LCP element on every page it appears, and must
 * never wait on JS/motion hydration to become visible (see docs/QUALITY_AUDIT.md).
 * Line breaks shift responsively; the per-word clip/translate mask holds up
 * at every width without recomputing anything.
 */
export function RevealWords({
  text,
  startMs = 120,
  stepMs = 55,
  lineClassName = "animate-hero-line",
}: {
  text: string;
  startMs?: number;
  stepMs?: number;
  lineClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        // The separating space is a sibling of the mask, not inside it: an
        // inline-block's shrink-to-fit width drops trailing whitespace, so a
        // space living inside the overflow-hidden mask collapses to 0 and
        // words render touching.
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.15em] align-bottom -mb-[0.15em]">
            <span
              className={cn("inline-block", lineClassName)}
              style={{ animationDelay: `${startMs + i * stepMs}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}
