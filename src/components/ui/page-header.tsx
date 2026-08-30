import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  heading,
  intro,
  className,
  children,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("border-b border-line bg-parchment-deep py-16 sm:py-20", className)}>
      <Container className="flex flex-col gap-4">
        <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-brass-ink">
          {eyebrow}
        </span>
        <h1 className="font-display text-display-lg text-ink">{heading}</h1>
        {intro && <p className="max-w-lg text-base leading-relaxed text-ink-soft">{intro}</p>}
        {children}
      </Container>
    </div>
  );
}
