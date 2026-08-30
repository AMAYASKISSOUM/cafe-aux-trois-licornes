"use client";

import { useSyncExternalStore } from "react";
import { motion, type Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A few related but distinct reveal treatments so photos across the site
 * don't all animate identically — a wide atmosphere shot reads better with
 * a slow clip reveal than the same fade-up used for a portrait product
 * shot. Pick per call site; default ("fade") preserves prior behavior.
 */
const revealVariants = {
  fade: {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  },
  scale: {
    hidden: { opacity: 0, scale: 1.045 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } },
  },
  clip: {
    hidden: { opacity: 0.001, clipPath: "inset(0 0 100% 0)" },
    show: { opacity: 1, clipPath: "inset(0 0 0% 0)", transition: { duration: 0.9, ease: EASE } },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -28 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 28 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
  },
} satisfies Record<string, Variants>;

export type RevealVariant = keyof typeof revealVariants;

const variants: Variants = revealVariants.fade;

const noopSubscribe = () => () => {};

/**
 * Content renders fully visible on the server and on first paint — the hidden/reveal
 * state only switches on after hydration. Framer/motion bakes `initial` inline via SSR,
 * so without this, content below the fold would be invisible until JS hydrates (or
 * forever, if JS fails to load). See the LCP incident on the hero for why this matters.
 */
function useRevealReady() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}) {
  const ready = useRevealReady();
  return (
    <motion.div
      className={className}
      initial={ready ? "hidden" : false}
      whileInView={ready ? "show" : undefined}
      viewport={{ once: true, margin: "-80px" }}
      variants={revealVariants[variant]}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function RevealGroup({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ready = useRevealReady();
  return (
    <motion.div
      className={className}
      style={style}
      initial={ready ? "hidden" : false}
      whileInView={ready ? "show" : undefined}
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
