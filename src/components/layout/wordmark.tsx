import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function Wordmark({
  className,
  dark,
  size = "md",
}: {
  className?: string;
  dark?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center", className)}
      aria-label="Café Aux Trois Licornes — accueil"
    >
      <Image
        src={dark ? "/images/brand/logo-on-dark.png" : "/images/brand/logo.png"}
        alt=""
        width={112}
        height={112}
        priority
        className={cn(
          "w-auto shrink-0 transition-transform duration-[var(--duration-fast)] group-hover:scale-[1.03]",
          size === "lg" ? "h-16 sm:h-20" : "h-11 sm:h-14"
        )}
      />
    </Link>
  );
}
