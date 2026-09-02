"use client";

import { useRef, useState, useCallback } from "react";

/**
 * Tracks which child of a horizontal scroll-snap strip is currently
 * centered, for a mobile active-dot indicator. Shared by the gallery and
 * reviews snap strips rather than duplicated per call site.
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

  return { ref, index, onScroll };
}
