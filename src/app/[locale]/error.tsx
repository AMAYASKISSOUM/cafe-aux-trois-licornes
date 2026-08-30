"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/business";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");
  const tCommon = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-error">
        {t("eyebrow")}
      </span>
      <h1 className="font-display text-display-lg text-ink">{t("heading")}</h1>
      <p className="max-w-md text-base leading-relaxed text-ink-soft">{t("body")}</p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <button type="button" onClick={reset} className={buttonVariants({})}>
          {t("retry")}
        </button>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          {tCommon("backHome")}
        </Link>
        <a href={`tel:${BUSINESS.phone}`} className={buttonVariants({ variant: "ghost" })}>
          <Phone className="h-4 w-4" aria-hidden />
          {BUSINESS.phoneDisplay}
        </a>
      </div>
    </Container>
  );
}
