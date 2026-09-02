import Image from "next/image";
import { Container } from "@/components/ui/container";
import { RevealWords } from "@/components/ui/reveal-words";
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
          <span className="animate-hero-fade-up text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-soft">
            {eyebrow}
          </span>
          <h1 className="font-display text-display-lg text-espresso-ink">
            <RevealWords text={heading} />
          </h1>
          {intro && (
            <p
              className="max-w-lg animate-hero-fade-up text-base leading-relaxed text-espresso-ink-soft"
              style={{ animationDelay: "160ms" }}
            >
              {intro}
            </p>
          )}
          {children && (
            <div className="animate-hero-fade-up" style={{ animationDelay: "260ms" }}>
              {children}
            </div>
          )}
        </Container>
      </div>
    );
  }

  return (
    <div className={cn("border-b border-line bg-parchment-deep py-16 sm:py-20", className)}>
      <Container className="flex flex-col gap-4">
        <span className="animate-hero-fade-up text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-ink">
          {eyebrow}
        </span>
        <h1 className="font-display text-display-lg text-ink">
          <RevealWords text={heading} />
        </h1>
        {intro && (
          <p
            className="max-w-lg animate-hero-fade-up text-base leading-relaxed text-ink-soft"
            style={{ animationDelay: "160ms" }}
          >
            {intro}
          </p>
        )}
        {children && (
          <div className="animate-hero-fade-up" style={{ animationDelay: "260ms" }}>
            {children}
          </div>
        )}
      </Container>
    </div>
  );
}
