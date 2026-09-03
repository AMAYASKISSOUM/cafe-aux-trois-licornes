"use client";

import { useRef, useState, useCallback, useEffect } from "react";

/**
 * Tracks which child of a horizontal scroll-snap strip is currently
 * centered, for a mobile active-dot indicator. Shared by the gallery and
 * reviews snap strips rather than duplicated per call site.
 *
 * Also gives the strip a one-time "swipe me" nudge shortly after mount —
 * a small scroll forward and back — so a first-time visitor notices the
 * strip is interactive before they've tried touching it. Skipped entirely
 * under prefers-reduced-motion.
 */
export function useSnapIndex() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let closestDistance = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const item = child as HTMLElement;
      const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    });
    setIndex(closest);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.scrollWidth <= el.clientWidth) return;

    const nudgeOut = window.setTimeout(() => {
      el.scrollBy({ left: 36, behavior: "smooth" });
    }, 700);
    const nudgeBack = window.setTimeout(() => {
      el.scrollBy({ left: -36, behavior: "smooth" });
    }, 1150);

    return () => {
      window.clearTimeout(nudgeOut);
      window.clearTimeout(nudgeBack);
    };
  }, []);

  return { ref, index, onScroll };
}
