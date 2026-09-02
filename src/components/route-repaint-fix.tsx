"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Works around a real Chromium paint bug: after a client-side route change,
 * the new page's DOM/React state is correct (confirmed via inspection) but
 * the old frame stays composited on screen until something forces a
 * repaint — a manual scroll fixes it instantly. Sticky-positioned elements
 * (the header here) are the known trigger for this class of bug. A same-
 * navigation scroll nudge (forward one frame, back the next) is the
 * standard workaround — net scroll position is unchanged.
 */
export function RouteRepaintFix() {
  const pathname = usePathname();

  useEffect(() => {
    const y = window.scrollY;
    const x = window.scrollX;
    window.scrollTo(x, y + 1);
    const id = requestAnimationFrame(() => window.scrollTo(x, y));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
