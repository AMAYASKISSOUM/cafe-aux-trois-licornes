"use client";

import { MotionConfig } from "motion/react";

/** Site-wide: every animation authored with motion/react auto-reduces for prefers-reduced-motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
