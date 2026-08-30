import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function Wordmark({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex flex-col leading-none",
        dark ? "text-espresso-ink" : "text-ink",
        className
      )}
      aria-label="Café Aux Trois Licornes — accueil"
    >
      <span
        className={cn(
          "text-[0.6875rem] font-medium uppercase tracking-[0.22em]",
          dark ? "text-espresso-ink-soft" : "text-ink-faint"
        )}
      >
        Café
      </span>
      <span className="font-display text-xl font-semibold tracking-[-0.01em] sm:text-[1.375rem]">
        Aux Trois Licornes
      </span>
    </Link>
  );
}
