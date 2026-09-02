import { TextReveal } from "@/components/ui/text-reveal";
import { LineReveal } from "@/components/ui/line-reveal";
import { cn } from "@/lib/cn";

/**
 * Every section title runs through one of two reveal treatments by default —
 * never a plain fade — so scroll rhythm varies without every call site
 * having to remember to opt in. Pass `reveal="none"` only when `heading` is
 * already a pre-composed node (e.g. wraps its own `TextReveal`/`t.rich` mark).
 */
export function SectionHeading({
  eyebrow,
  heading,
  align = "left",
  dark = false,
  reveal = "word",
  className,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  reveal?: "word" | "line" | "none";
  className?: string;
}) {
  const headingNode =
    typeof heading === "string" && reveal === "word" ? (
      <TextReveal text={heading} />
    ) : typeof heading === "string" && reveal === "line" ? (
      <LineReveal>{heading}</LineReveal>
    ) : (
      heading
    );

  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      <span
        className={cn(
          "text-eyebrow font-semibold uppercase tracking-[0.16em]",
          dark ? "text-petrol-soft" : "text-petrol-ink"
        )}
      >
        {eyebrow}
      </span>
      <h2 className={cn("font-display text-display-md", dark ? "text-espresso-ink" : "text-ink")}>
        {headingNode}
      </h2>
    </div>
  );
}
