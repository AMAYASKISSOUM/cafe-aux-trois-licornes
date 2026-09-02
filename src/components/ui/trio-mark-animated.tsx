import { AnimatedDrawPath } from "@/components/ui/animated-draw-path";
import { cn } from "@/lib/cn";

/**
 * Same three-path glyph as `TrioMark`, but draws itself in stroke-by-stroke
 * with Anime.js instead of rendering static. Kept as a separate component
 * (rather than a mode on TrioMark) so every plain usage — including inside
 * `ImagePlaceholder`, which renders dozens of times per page — stays a
 * server-renderable, zero-JS SVG.
 */
const PATHS = [
  "M8 30C8 30 6 18 8 10C9.2 5.6 12 2 12 2",
  "M24 30C24 30 21.5 14 24 4",
  "M40 30C40 30 38 19 40 12C41 8.4 36 2 36 2",
] as const;

export function AnimatedTrioMark({
  className,
  trigger = "inview",
}: {
  className?: string;
  /** "inview": draws once when scrolled near the viewport. "mount": draws shortly after mount (for above-the-fold placements). */
  trigger?: "inview" | "mount";
}) {
  return (
    <AnimatedDrawPath
      d={PATHS}
      viewBox="0 0 48 32"
      strokeWidth={1.6}
      trigger={trigger}
      duration={1100}
      staggerMs={180}
      mountDelay={1300}
      className={cn("h-4 w-6", className)}
    />
  );
}
