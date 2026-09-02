"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { useLocale } from "next-intl";

export function LanguageSwitch({ dark, size = "sm" }: { dark?: boolean; size?: "sm" | "lg" }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  if (size === "lg") {
    return (
      <div role="group" aria-label="Language / Langue" className="flex items-center gap-2 text-base font-medium">
        {routing.locales.map((l) => (
          <button
            key={l}
            type="button"
            aria-current={l === locale ? "true" : undefined}
            disabled={l === locale}
            onClick={() => router.replace(pathname, { locale: l })}
            className={cn(
              "rounded-full border px-4 py-1.5 uppercase tracking-[0.04em] transition-colors duration-[var(--duration-fast)] disabled:cursor-default",
              l === locale
                ? "border-brass-soft bg-brass-soft/15 text-espresso-ink"
                : "border-espresso-ink/20 text-espresso-ink-soft hover:border-espresso-ink/40 hover:text-espresso-ink"
            )}
          >
            {l}
          </button>
        ))}
      </div>
    );
  }

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
