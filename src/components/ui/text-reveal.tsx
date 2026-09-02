"use client";

import { useSyncExternalStore } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const word: Variants = {
  hidden: { y: "100%" },
  show: { y: "0%", transition: { duration: 0.55, ease: EASE } },
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
 * Word-by-word mask reveal for a single below-the-fold statement heading.
 * Reserved for the one or two "big statement" moments per page (Experience,
 * ReservationCta) — most headings stay on the plain `Reveal` fade so the
 * mask effect keeps its impact instead of becoming wallpaper.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ready = useRevealReady();
  const words = text.split(" ");

  return (
    <motion.span
      className={cn("inline", className)}
      initial={ready ? "hidden" : false}
      whileInView={ready ? "show" : undefined}
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      transition={{ delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]">
          <motion.span variants={word} className="inline-block">
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
