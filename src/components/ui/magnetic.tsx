"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

const RANGE = 14;
const PULL = 0.35;

/**
 * Wraps a single CTA so it drifts a few px toward the pointer on desktop —
 * reserved for the one or two truly primary actions per page, not every
 * button. Only reacts to `pointerType === "mouse"`, so touch devices pay
 * zero cost (the handler runs but every value stays at 0) and never get an
 * uncanny "stuck offset" from a touch that never triggers pointerleave.
 */
export function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 16, mass: 0.4 });

  function handlePointerMove(e: React.PointerEvent<HTMLSpanElement>) {
    if (prefersReduced || e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(Math.max(-RANGE, Math.min(RANGE, (e.clientX - (rect.left + rect.width / 2)) * PULL)));
    y.set(Math.max(-RANGE, Math.min(RANGE, (e.clientY - (rect.top + rect.height / 2)) * PULL)));
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
      className={className ? className : "inline-block"}
    >
      {children}
    </motion.span>
  );
}
