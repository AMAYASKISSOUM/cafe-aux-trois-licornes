import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { TrioMark } from "@/components/ui/mark";
import { Reveal } from "@/components/ui/reveal";

export async function ReservationCta() {
  const [t, tCommon] = await Promise.all([
    getTranslations("home.reservationCta"),
    getTranslations("common"),
  ]);

  return (
    <section className="relative overflow-hidden bg-espresso py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 text-brass/[0.08]"
      >
        <TrioMark className="h-72 w-96" />
      </div>
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Reveal className="flex flex-col items-center gap-6">
          <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-brass-soft">
            {t("eyebrow")}
          </span>
          <h2 className="font-display text-display-lg text-espresso-ink">{t("heading")}</h2>
          <p className="max-w-md text-base leading-relaxed text-espresso-ink-soft">{t("body")}</p>
          <Link href="/reservation" className={buttonVariants({ className: "mt-2" })}>
            {tCommon("reserveTable")}
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
