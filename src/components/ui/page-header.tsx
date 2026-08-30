import Image from "next/image";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  heading,
  intro,
  className,
  children,
  image,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  className?: string;
  children?: React.ReactNode;
  image?: { src: string; alt: string };
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-espresso py-24 sm:py-28", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--color-espresso) 88%, transparent) 0%, color-mix(in srgb, var(--color-espresso) 55%, transparent) 55%, color-mix(in srgb, var(--color-espresso) 20%, transparent) 100%)",
          }}
        />
        <Container className="relative z-10 flex flex-col gap-4">
          <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-soft">
            {eyebrow}
          </span>
          <h1 className="font-display text-display-lg text-espresso-ink">{heading}</h1>
          {intro && <p className="max-w-lg text-base leading-relaxed text-espresso-ink-soft">{intro}</p>}
          {children}
        </Container>
      </div>
    );
  }

  return (
    <div className={cn("border-b border-line bg-parchment-deep py-16 sm:py-20", className)}>
      <Container className="flex flex-col gap-4">
        <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-ink">
          {eyebrow}
        </span>
        <h1 className="font-display text-display-lg text-ink">{heading}</h1>
        {intro && <p className="max-w-lg text-base leading-relaxed text-ink-soft">{intro}</p>}
        {children}
      </Container>
    </div>
  );
}
