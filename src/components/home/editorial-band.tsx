import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { LineReveal } from "@/components/ui/line-reveal";

/**
 * Section-transition technique #3 (alongside the background-tone shift into
 * FeaturedMenu and the drawn `SectionDivider`): an oversized editorial
 * restatement of the hero line, on its own dark band between Gallery and
 * Reviews — a beat to pause on rather than a wall of body copy. Echoes the
 * hero headline rather than inventing new marketing copy.
 */
export async function EditorialBand() {
  const t = await getTranslations("home.hero");

  return (
    <section className="bg-espresso py-20 sm:py-28">
      <Container>
        <LineReveal className="mx-auto max-w-4xl text-center font-display text-display-md italic leading-[1.15] text-espresso-ink sm:text-display-lg">
          {t("headline")}
        </LineReveal>
      </Container>
    </section>
  );
}
