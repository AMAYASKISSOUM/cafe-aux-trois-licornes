import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  heading,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
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
          dark ? "text-brass-soft" : "text-brass-ink"
        )}
      >
        {eyebrow}
      </span>
      <h2 className={cn("font-display text-display-md", dark ? "text-espresso-ink" : "text-ink")}>
        {heading}
      </h2>
    </div>
  );
}
