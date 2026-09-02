import { ArrowRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Each variant gets one distinct hover treatment rather than stacking every
 * effect on every button — primary (the "buy" action) gets a light shine
 * sweep, secondary/on-dark (navigational) get a fill wipe. Both are
 * transform/pseudo-element only, so they cost nothing beyond what the
 * previous flat hover states already cost.
 */
export const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-[0.9375rem] font-medium tracking-[0.01em] duration-[var(--duration-fast)] ease-[var(--ease-editorial)] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "isolate overflow-hidden bg-petrol text-parchment transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-petrol-deep active:translate-y-0 active:scale-[0.98] active:bg-petrol-deep after:pointer-events-none after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.35)_48%,transparent_66%)] after:transition-transform after:duration-700 after:ease-[var(--ease-editorial)] hover:after:translate-x-full motion-reduce:after:hidden",
        secondary:
          "isolate overflow-hidden border border-ink/25 text-ink transition-[color,border-color,transform] hover:-translate-y-0.5 hover:border-ink active:translate-y-0 active:scale-[0.98] before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-ink/[0.05] before:transition-transform before:duration-300 before:ease-[var(--ease-editorial)] hover:before:scale-x-100",
        "on-dark":
          "isolate overflow-hidden border border-espresso-ink/30 text-espresso-ink transition-[color,border-color,transform] hover:-translate-y-0.5 hover:border-espresso-ink active:translate-y-0 active:scale-[0.98] before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-espresso-ink/10 before:transition-transform before:duration-300 before:ease-[var(--ease-editorial)] hover:before:scale-x-100",
        ghost:
          "text-brass-ink underline decoration-brass/40 underline-offset-4 transition-[color,text-decoration-color] hover:decoration-brass-ink hover:underline-offset-[6px] px-0",
      },
      size: {
        md: "h-12 px-6",
        sm: "h-10 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonVariantProps extends VariantProps<typeof buttonVariants> {
  className?: string;
}

/** Native button element. For links, apply `buttonVariants({...})` to next-intl's `Link`. */
export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonVariantProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/**
 * Shared trailing-arrow atom for CTA/nav links — pairs with the `group`
 * class already on `buttonVariants` so the nudge-on-hover works with zero
 * JS wherever it's dropped in.
 */
export function ButtonArrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:translate-x-1",
        className
      )}
      aria-hidden
    />
  );
}
