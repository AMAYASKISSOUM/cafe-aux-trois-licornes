import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Photo } from "@/components/ui/photo";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

interface Pillar {
  title: string;
  body: string;
}

export async function Experience() {
  const t = await getTranslations("home.experience");
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} align="center" />
        </Reveal>
        <Reveal>
          <Photo
            alt={t("imageLabel")}
            label={t("imageLabel")}
            ratio="21/9"
            className="hidden sm:block"
          />
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:divide-x sm:divide-line">
          {pillars.map((pillar, i) => (
            <RevealItem key={pillar.title} className="flex flex-col gap-3 sm:px-8 sm:first:pl-0 sm:last:pr-0">
              <span className="font-display text-2xl text-brass">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-lg text-ink">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{pillar.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
