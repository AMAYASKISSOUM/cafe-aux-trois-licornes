import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { TrioMark } from "@/components/ui/mark";
import { NAV_ITEMS } from "@/lib/nav";

export default async function NotFound() {
  const [t, tNav] = await Promise.all([getTranslations("notFoundPage"), getTranslations("nav")]);

  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <TrioMark className="h-6 w-9 text-brass" />
      <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-petrol-ink">
        {t("eyebrow")}
      </span>
      <h1 className="font-display text-display-lg text-ink">{t("heading")}</h1>
      <p className="max-w-md text-base leading-relaxed text-ink-soft">{t("body")}</p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className={buttonVariants({})}>
          {tNav("home")}
        </Link>
        <Link href="/menu" className={buttonVariants({ variant: "secondary" })}>
          {tNav("menu")}
        </Link>
      </div>

      <nav aria-label={tNav("home")} className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="text-ink-soft hover:text-ink">
            {tNav(item.labelKey)}
          </Link>
        ))}
      </nav>
    </Container>
  );
}
