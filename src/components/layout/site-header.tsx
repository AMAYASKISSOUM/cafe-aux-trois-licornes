"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/layout/wordmark";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const first = panelRef.current?.querySelector<HTMLElement>("a[href], button:not([disabled])");
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])"
      );
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-[var(--duration-fast)]",
          scrolled || open
            ? "border-line bg-parchment/92 shadow-lift backdrop-blur-sm"
            : "border-transparent bg-parchment"
        )}
      >
        <Container className="flex h-[4.5rem] items-center justify-between sm:h-20">
        <Wordmark />

        <nav aria-label="Principale" className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-1 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:text-ink",
                  active && "text-ink"
                )}
              >
                {t(item.labelKey)}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-rust transition-transform duration-[var(--duration-fast)]",
                    active && "scale-x-100"
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LanguageSwitch />
          <Link href="/reservation" className={buttonVariants({ size: "sm" })}>
            {t("reserve")}
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          className="flex h-11 w-11 items-center justify-center text-ink lg:hidden"
        >
          <MenuGlyph open={open} />
        </button>
        </Container>
      </header>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-espresso/40 transition-opacity duration-[var(--duration-base)] lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Mobile drawer */}
      <div
        id="mobile-nav-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("openMenu")}
        inert={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-[86vw] max-w-sm flex-col bg-paper shadow-soft transition-transform duration-[var(--duration-base)] ease-[var(--ease-editorial)] lg:hidden",
          "pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav aria-label="Principale" className="flex flex-col gap-1 px-6 pt-4">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 font-display text-2xl text-ink"
              style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-5 px-6 pt-6">
          <Link
            href="/reservation"
            onClick={() => setOpen(false)}
            className={buttonVariants({ className: "w-full" })}
          >
            {t("reserve")}
          </Link>
          <LanguageSwitch />
        </div>
      </div>
    </>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden>
      <span
        className={cn(
          "absolute left-0 h-px w-full bg-current transition-transform duration-[var(--duration-fast)]",
          open ? "top-1/2 rotate-45" : "top-0 rotate-0"
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-1/2 h-px w-full bg-current transition-opacity duration-[var(--duration-fast)]",
          open ? "opacity-0" : "opacity-100"
        )}
      />
      <span
        className={cn(
          "absolute left-0 h-px w-full bg-current transition-transform duration-[var(--duration-fast)]",
          open ? "top-1/2 -rotate-45" : "top-full -translate-y-px rotate-0"
        )}
      />
    </span>
  );
}
