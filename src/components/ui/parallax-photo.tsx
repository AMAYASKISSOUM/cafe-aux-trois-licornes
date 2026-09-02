"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { cn } from "@/lib/cn";

/**
 * Same box as `Photo`, but the image sits on an oversized inner layer
 * (±6% on every side) that drifts a few px against scroll — the 6% buffer
 * is comfortably larger than `range`, so the drift never exposes an edge.
 * Reserved for the one or two photos per page where a bit of depth reads
 * as intentional rather than every image doing it.
 */
export function ParallaxPhoto({
  src,
  alt,
  label,
  ratio = "4/5",
  sizes = "100vw",
  className,
  imgClassName,
  range = 22,
}: {
  src?: string;
  alt: string;
  label?: string;
  ratio?: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  range?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden bg-parchment-deep", className)}
      style={{ aspectRatio: ratio }}
    >
      <motion.div className="absolute inset-[-6%]" style={{ y: prefersReduced ? 0 : y }}>
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", imgClassName)} />
        ) : (
          <ImagePlaceholder label={label ?? alt} className="absolute inset-0" />
        )}
      </motion.div>
    </div>
  );
}
