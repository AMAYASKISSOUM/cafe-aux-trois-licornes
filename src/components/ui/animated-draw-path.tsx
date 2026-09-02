"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Generic Anime.js stroke-draw primitive — one or more SVG paths draw
 * themselves in on view (or shortly after mount). Backs `AnimatedTrioMark`,
 * the hand-drawn underline, the self-drawing section divider, and the CTA
 * outline frame, so the dynamic-import + IntersectionObserver + cleanup
 * logic lives in exactly one place. Anime.js is dynamically imported so it
 * never enters the main bundle for pages that render none of these.
 */
export function AnimatedDrawPath({
  d,
  viewBox,
  className,
  strokeWidth = 1.6,
  trigger = "inview",
  duration = 1000,
  staggerMs = 150,
  mountDelay = 300,
  rootMargin = "-80px",
  preserveAspectRatio,
  nonScalingStroke = false,
}: {
  d: string | readonly string[];
  viewBox: string;
  className?: string;
  strokeWidth?: number;
  /** "inview": draws once when scrolled near the viewport. "mount": draws shortly after mount (for above-the-fold placements). */
  trigger?: "inview" | "mount";
  duration?: number;
  staggerMs?: number;
  mountDelay?: number;
  rootMargin?: string;
  preserveAspectRatio?: string;
  nonScalingStroke?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let controls: { pause: () => void } | undefined;

    async function play() {
      const { animate, svg, stagger } = await import("animejs");
      if (cancelled || !svgEl) return;
      const paths = svgEl.querySelectorAll("path");
      controls = animate(svg.createDrawable(paths), {
        draw: ["0 0", "0 1"],
        duration,
        delay: paths.length > 1 ? stagger(staggerMs) : 0,
        ease: "outQuad",
      });
    }

    if (trigger === "mount") {
      const id = window.setTimeout(play, mountDelay);
      return () => {
        cancelled = true;
        window.clearTimeout(id);
        controls?.pause();
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.1 }
    );
    observer.observe(svgEl);
    return () => {
      cancelled = true;
      observer.disconnect();
      controls?.pause();
    };
  }, [trigger, duration, staggerMs, mountDelay, rootMargin]);

  const paths = Array.isArray(d) ? d : [d];

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      fill="none"
      preserveAspectRatio={preserveAspectRatio}
      className={cn(className)}
      aria-hidden="true"
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          vectorEffect={nonScalingStroke ? "non-scaling-stroke" : undefined}
        />
      ))}
    </svg>
  );
}
