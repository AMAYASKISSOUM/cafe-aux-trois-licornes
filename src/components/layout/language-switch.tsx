"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { useLocale } from "next-intl";

export function LanguageSwitch({ dark }: { dark?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  return (
    <div
      role="group"
      aria-label="Language / Langue"
      className="flex items-center gap-1.5 text-[0.8125rem] font-medium"
    >
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className={dark ? "text-espresso-ink-soft/60" : "text-ink-faint/60"}>
              /
            </span>
          )}
          <button
            type="button"
            aria-current={l === locale ? "true" : undefined}
            disabled={l === locale}
            onClick={() => router.replace(pathname, { locale: l })}
            className={cn(
              "uppercase tracking-[0.04em] disabled:cursor-default",
              l === locale
                ? dark
                  ? "text-espresso-ink"
                  : "text-ink"
                : dark
                  ? "text-espresso-ink-soft hover:text-espresso-ink"
                  : "text-ink-faint hover:text-ink"
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
