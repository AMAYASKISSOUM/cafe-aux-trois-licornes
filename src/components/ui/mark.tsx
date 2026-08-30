import { cn } from "@/lib/cn";

/**
 * Abstract trio glyph — three slender tapered forms of varying height.
 * A quiet nod to "Trois Licornes" without literal illustration.
 */
export function TrioMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 32"
      fill="none"
      className={cn("h-4 w-6", className)}
      aria-hidden="true"
    >
      <path
        d="M8 30C8 30 6 18 8 10C9.2 5.6 12 2 12 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M24 30C24 30 21.5 14 24 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M40 30C40 30 38 19 40 12C41 8.4 36 2 36 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
