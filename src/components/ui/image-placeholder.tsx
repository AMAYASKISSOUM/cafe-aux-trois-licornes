import { cn } from "@/lib/cn";
import { TrioMark } from "@/components/ui/mark";

export function ImagePlaceholder({
  label,
  className,
  labelPosition = "center",
}: {
  label?: string;
  className?: string;
  /** "top" avoids colliding with text that's anchored to the bottom of the same box (e.g. a hero). */
  labelPosition?: "center" | "top";
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full overflow-hidden bg-parchment-deep",
        labelPosition === "top" ? "items-start justify-center pt-12 sm:pt-16" : "items-center justify-center",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-brass-soft) 0px, var(--color-brass-soft) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, transparent 40%, color-mix(in srgb, var(--color-espresso) 12%, transparent) 100%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2.5 px-6 text-center">
        <TrioMark className="h-4 w-6 text-brass" />
        {label && (
          <span className="text-eyebrow max-w-[16ch] font-medium uppercase tracking-[0.14em] text-ink-faint">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
