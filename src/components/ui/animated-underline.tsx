import { AnimatedDrawPath } from "@/components/ui/animated-draw-path";
import { cn } from "@/lib/cn";

/**
 * Wraps an emphasized word/phrase with a single hand-drawn stroke underneath
 * that draws itself in as the phrase scrolls into view (Anime.js, via
 * `AnimatedDrawPath`) — for the one or two words per page that earn a
 * signature moment, not a sitewide underline style.
 */
export function AnimatedUnderline({
  children,
  className,
  markClassName,
}: {
  children: React.ReactNode;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      {children}
      <AnimatedDrawPath
        d="M1.5 6.5C22 1.5 55 1 85 4.5C110 7.3 150 8.5 178.5 3"
        viewBox="0 0 180 9"
        preserveAspectRatio="none"
        strokeWidth={2.5}
        nonScalingStroke
        duration={650}
        className={cn(
          "pointer-events-none absolute -bottom-1 left-0 h-[0.22em] w-full text-brass sm:-bottom-1.5",
          markClassName
        )}
      />
    </span>
  );
}
