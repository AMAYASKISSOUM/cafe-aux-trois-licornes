"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Lightbox, type LightboxImage } from "@/components/ui/lightbox";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

const MOSAIC_SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

export interface GalleryPreviewImage extends LightboxImage {
  slug: string;
}

interface Labels {
  close: string;
  previous: string;
  next: string;
  openImage: string;
}

const THUMB_BASE =
  "group relative block h-full w-full appearance-none overflow-hidden bg-parchment-deep p-0 text-left";

/**
 * Client half of the gallery preview: the server component fetches +
 * localizes the images, this owns the tap/hover interactions (lightbox
 * open state, hover caption reveal) that need the browser.
 */
export function GalleryPreviewInteractive({ images, labels }: { images: GalleryPreviewImage[]; labels: Labels }) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      {/* Mobile: horizontal snap strip, next card peeking in at the edge */}
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:hidden">
        {images.map((img, i) => (
          <div key={img.slug} className="relative aspect-[4/5] w-[72vw] flex-none snap-start">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${labels.openImage} — ${img.alt}`}
              className={THUMB_BASE}
            >
              <GalleryThumb img={img} sizes="72vw" alwaysShowBadge />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop: editorial mosaic with hover expansion */}
      <RevealGroup
        className="mt-10 hidden auto-rows-[minmax(140px,1fr)] grid-cols-4 grid-rows-2 gap-3 sm:grid"
        style={{ gridAutoFlow: "dense" }}
      >
        {images.map((img, i) => (
          <RevealItem key={img.slug} className={cn("relative", MOSAIC_SPANS[i % MOSAIC_SPANS.length])}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${labels.openImage} — ${img.alt}`}
              className={cn(
                THUMB_BASE,
                "transition-transform duration-500 ease-[var(--ease-editorial)] hover:z-10 hover:scale-[1.02] hover:shadow-soft"
              )}
            >
              <GalleryThumb img={img} sizes="(min-width: 640px) 45vw, 100vw" />
            </button>
          </RevealItem>
        ))}
      </RevealGroup>

      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} labels={labels} />
    </>
  );
}

function GalleryThumb({
  img,
  sizes,
  alwaysShowBadge = false,
}: {
  img: GalleryPreviewImage;
  sizes: string;
  alwaysShowBadge?: boolean;
}) {
  return (
    <>
      {img.src ? (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-110"
        />
      ) : (
        <ImagePlaceholder label={img.alt} className="h-full w-full" />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,20,15,0.55),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="absolute bottom-3 left-3 right-3 translate-y-2 text-sm font-medium text-espresso-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {img.alt}
      </span>
      <Maximize2
        aria-hidden
        className={cn(
          "absolute right-3 top-3 h-4 w-4 text-espresso-ink drop-shadow transition-opacity duration-300",
          alwaysShowBadge ? "opacity-70" : "opacity-0 group-hover:opacity-90"
        )}
      />
    </>
  );
}
