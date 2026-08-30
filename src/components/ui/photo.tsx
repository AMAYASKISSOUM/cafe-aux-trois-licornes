import Image from "next/image";
import { cn } from "@/lib/cn";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

interface PhotoProps {
  /** Omit until the real photograph is added — renders a labeled placeholder instead. */
  src?: string;
  alt: string;
  ratio?: string;
  label?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
}

export function Photo({
  src,
  alt,
  ratio = "4/5",
  label,
  priority,
  sizes = "100vw",
  className,
  imgClassName,
}: PhotoProps) {
  return (
    <div
      className={cn("relative overflow-hidden bg-parchment-deep", className)}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <ImagePlaceholder label={label ?? alt} className="absolute inset-0" />
      )}
    </div>
  );
}
