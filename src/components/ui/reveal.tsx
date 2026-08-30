"use client";

import { useSyncExternalStore } from "react";
import { motion, type Variants } from "motion/react";

const variants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

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
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ready = useRevealReady();
  return (
    <motion.div
      className={className}
      initial={ready ? "hidden" : false}
      whileInView={ready ? "show" : undefined}
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
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
