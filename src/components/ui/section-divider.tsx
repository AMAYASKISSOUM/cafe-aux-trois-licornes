import { AnimatedDrawPath } from "@/components/ui/animated-draw-path";
import { TrioMark } from "@/components/ui/mark";
import { cn } from "@/lib/cn";

/**
 * A self-drawing rule with the brand's trio glyph riding the centre —
 * dropped between two sections in place of a plain gap, so the seam reads
 * as a designed transition rather than a boundary. Used sparingly (once,
 * maybe twice a page) so it keeps reading as a moment.
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex max-w-xs items-center gap-4 text-line-strong sm:max-w-sm", className)}>
      <AnimatedDrawPath
        d="M1 1H99"
        viewBox="0 0 100 2"
        duration={700}
        strokeWidth={1}
        nonScalingStroke
        className="h-px flex-1"
      />
      <TrioMark className="h-3.5 w-5 shrink-0 text-brass" />
      <AnimatedDrawPath
        d="M1 1H99"
        viewBox="0 0 100 2"
        duration={700}
        strokeWidth={1}
        nonScalingStroke
        className="h-px flex-1"
      />
    </div>
  );
}
