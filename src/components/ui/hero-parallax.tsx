"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Transform-only scroll drift for the hero photo layer — never touches
 * opacity, so it can't reintroduce the LCP-hiding bug a plain CSS `scale`
 * reveal already fixed on the `<Image>` itself (see globals.css). `y` starts
 * at 0, identical to the unwrapped state, so there's nothing for SSR/first
 * paint to get wrong before this hydrates.
 */
export function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <motion.div ref={ref} className="absolute inset-0" style={{ y: prefersReduced ? 0 : y }}>
      {children}
    </motion.div>
  );
}
