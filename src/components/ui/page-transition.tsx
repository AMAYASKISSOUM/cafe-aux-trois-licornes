"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Route-change transition, not a first-load one: `initial={false}` on both
 * `AnimatePresence` and the panel means the very first paint renders at the
 * final `animate` values with no hidden state baked into SSR — only a
 * subsequent client-side navigation (which by definition runs after
 * hydration) ever plays the fade/mask. Keyed on the internal (locale-free)
 * pathname, so switching FR/EN in place doesn't replay it.
 */
export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={pathname}
        id="main"
        className={cn("flex flex-1 flex-col", className)}
        initial={{ opacity: 0, y: 10, clipPath: "inset(0 0 3% 0)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.36, ease: EASE }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
