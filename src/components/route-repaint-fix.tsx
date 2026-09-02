"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Works around a real Chromium paint bug: after a client-side route change,
 * the new page's DOM/React state is correct (confirmed via inspection) but
 * the old frame stays composited on screen until something forces a
 * repaint. Sticky-positioned elements (the header here) are the known
 * trigger for this class of bug.
 *
 * Scrolling fixes it when a real user does it, but a programmatic
 * `window.scrollTo` nudge (tried first, at 1px and then 40px repeated over
 * 500ms) did not — confirmed on production that the DOM already had the
 * new page's content while the nudge ran, yet paint still didn't update.
 * A real user scroll goes through the compositor's input-driven path;
 * `scrollTo` apparently doesn't force the same recomposite here. Toggling
 * `display` does: it removes the subtree from the render tree and puts it
 * back, which cannot be short-circuited the way a scroll can. Reading
 * `offsetHeight` in between forces the browser to apply the `none` before
 * moving on, so the two writes don't get coalesced into a no-op. Both
 * writes happen in the same task, before any paint, so there's nothing to
 * see — no flash.
 */
export function RouteRepaintFix() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const body = document.body;
    const previousDisplay = body.style.display;
    try {
      body.style.display = "none";
      void body.offsetHeight;
    } finally {
      body.style.display = previousDisplay;
    }
  }, [pathname]);

  return null;
}
