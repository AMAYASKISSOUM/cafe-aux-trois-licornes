"use client";

import { useSyncExternalStore } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

const line: Variants = {
  hidden: { y: "100%" },
  show: { y: "0%", transition: { duration: 0.7, ease: EASE } },
};

const noopSubscribe = () => () => {};

/** Same hydration-safety technique as `Reveal` — see reveal.tsx for why. */
function useRevealReady() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

/**
 * Masks a whole line and slides it up into place in one deliberate beat —
 * for below-the-fold headings that want a single editorial move instead of
 * `TextReveal`'s per-word stagger. Pick one or the other per heading so the
 * page doesn't repeat the same reveal everywhere.
 */
export function LineReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ready = useRevealReady();
  return (
    <span className={cn("block overflow-hidden pb-[0.1em] -mb-[0.1em]", className)}>
      <motion.span
        className="block"
        initial={ready ? "hidden" : false}
        whileInView={ready ? "show" : undefined}
        viewport={{ once: true, margin: "-80px" }}
        variants={line}
        transition={{ delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
