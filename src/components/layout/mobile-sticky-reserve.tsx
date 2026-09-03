"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonVariants, ButtonArrow } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Floating "Reserve" CTA for mobile. The desktop header keeps its own
 * Reserve link visible at all times, but that slot is hidden below `lg`
 * (folded into the full-screen menu instead) — so once a mobile visitor
 * scrolls past the hero, there's no reservation action on screen until
 * they open the menu. Plain CSS transform/opacity toggled by a class, no
 * Motion/AnimatePresence: the element is always mounted, so there's no
 * exit-animation to get stuck mid-flight (see route-repaint-fix.tsx for
 * why that failure mode matters here).
 */
export function MobileStickyReserve() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.75);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/reservation") return null;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-4 z-30 transition-[transform,opacity] duration-300 ease-[var(--ease-editorial)] lg:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      )}
      style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))" }}
    >
      <Link
        href="/reservation"
        tabIndex={visible ? undefined : -1}
        className={buttonVariants({ className: "w-full shadow-soft active:scale-[0.96]" })}
      >
        {t("reserveTable")}
        <ButtonArrow />
      </Link>
    </div>
  );
}
