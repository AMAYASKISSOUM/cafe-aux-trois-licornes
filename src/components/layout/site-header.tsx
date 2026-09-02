"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { MapPin, Phone } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { BUSINESS } from "@/lib/business";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/layout/wordmark";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { buttonVariants, ButtonArrow } from "@/components/ui/button";
import { AnimatedTrioMark } from "@/components/ui/trio-mark-animated";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

const navListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.16 } },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.35 } },
};

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
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
          "animate-nav-reveal sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-[var(--duration-fast)]",
          scrolled || open
            ? "border-line bg-parchment/92 shadow-lift backdrop-blur-sm"
            : "border-transparent bg-parchment"
        )}
      >
        <Container className="flex h-[4.5rem] items-center justify-between sm:h-20">
        <Wordmark />

        <nav
          aria-label="Principale"
          className="hidden items-center gap-0.5 lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const indicated = hovered ? hovered === item.href : active;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHovered(item.href)}
                onFocus={() => setHovered(item.href)}
                className="relative rounded-full px-4 py-2 text-[0.9375rem] font-medium"
              >
                {indicated && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-petrol-tint"
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "relative transition-colors duration-[var(--duration-level1)]",
                    indicated ? "text-petrol-deep" : "text-ink-soft"
                  )}
                >
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LanguageSwitch />
          <Link href="/reservation" className={buttonVariants({ size: "sm" })}>
            {t("reserve")}
            <ButtonArrow />
          </Link>
        </div>

        <motion.button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.15 }}
          className="flex h-11 w-11 items-center justify-center text-ink lg:hidden"
        >
          <MenuGlyph open={open} />
        </motion.button>
        </Container>
      </header>

      {/* Full-screen mobile menu — sits below the header so its own toggle button (now showing ×) stays the single, visible close control. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("openMenu")}
            className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 flex flex-col overflow-hidden bg-espresso sm:top-20 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 text-brass/[0.1]">
              <AnimatedTrioMark className="h-56 w-72" trigger="mount" />
            </div>

            <motion.nav
              aria-label="Principale"
              className="flex flex-1 flex-col justify-center gap-1 px-6"
              initial="hidden"
              animate="show"
              variants={navListVariants}
            >
              {NAV_ITEMS.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <motion.div key={item.href} variants={navItemVariants}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline gap-4 border-b border-line-on-dark py-3.5"
                    >
                      <span
                        className={cn(
                          "font-display text-base tabular-nums transition-colors",
                          active ? "text-brass-soft" : "text-espresso-ink-soft/50"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-4xl transition-colors",
                          active ? "text-espresso-ink" : "text-espresso-ink-soft group-hover:text-espresso-ink"
                        )}
                      >
                        {t(item.labelKey)}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            <motion.div
              className="mt-auto flex flex-col gap-6 px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-6"
              initial="hidden"
              animate="show"
              variants={footerVariants}
            >
              <div className="flex flex-col gap-2 text-sm text-espresso-ink-soft">
                <a
                  href={BUSINESS.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-espresso-ink"
                >
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {BUSINESS.address.street}, {BUSINESS.address.city}
                </a>
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-espresso-ink"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  {BUSINESS.phoneDisplay}
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/reservation"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ className: "flex-1" })}
                >
                  {t("reserve")}
                  <ButtonArrow />
                </Link>
                <LanguageSwitch dark size="lg" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
