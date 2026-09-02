import { cn } from "@/lib/cn";

/**
 * Vertical text-slide hover for plain text links (Kokonut UI's "Slide Text
 * Button" pattern) — a duplicate label slides up from below on hover. Purely
 * decorative on touch devices (no hover event), so it degrades to static
 * text there rather than requiring interaction.
 */
export function SlideText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("group/slide relative inline-block overflow-hidden align-bottom", className)}>
      <span className="inline-block transition-transform duration-[var(--duration-level2)] ease-[var(--ease-editorial)] group-hover/slide:-translate-y-full">
        {text}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full inline-block transition-transform duration-[var(--duration-level2)] ease-[var(--ease-editorial)] group-hover/slide:-translate-y-full"
      >
        {text}
      </span>
    </span>
  );
}
