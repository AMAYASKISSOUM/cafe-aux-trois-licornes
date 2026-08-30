import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-[0.9375rem] font-medium tracking-[0.01em] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-editorial)] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-rust text-parchment hover:bg-rust-dark active:bg-rust-dark",
        secondary:
          "border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.04] active:bg-ink/[0.06]",
        "on-dark":
          "border border-espresso-ink/30 text-espresso-ink hover:border-espresso-ink hover:bg-espresso-ink/10",
        ghost:
          "text-brass-ink underline decoration-brass/40 underline-offset-4 hover:decoration-brass-ink px-0",
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
