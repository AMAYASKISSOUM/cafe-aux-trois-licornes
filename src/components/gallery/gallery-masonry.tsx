"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Lightbox, type LightboxImage } from "@/components/ui/lightbox";

export interface MasonryImage extends LightboxImage {
  slug: string;
}

interface Labels {
  close: string;
  previous: string;
  next: string;
  openImage: string;
}

export function GalleryMasonry({ images, labels }: { images: MasonryImage[]; labels: Labels }) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <div key={img.slug} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${labels.openImage} — ${img.alt}`}
              className="group relative block w-full appearance-none overflow-hidden bg-parchment-deep p-0 text-left"
              style={{ aspectRatio: img.ratio ?? "4/5" }}
            >
              {img.src ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.05]"
                />
              ) : (
                <ImagePlaceholder label={img.alt} className="absolute inset-0" />
              )}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,20,15,0.5),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <Maximize2
                aria-hidden
                className="absolute right-3 top-3 h-4 w-4 text-espresso-ink opacity-70 drop-shadow transition-opacity duration-300 group-hover:opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
              />
            </button>
          </div>
        ))}
      </div>

      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} labels={labels} />
    </>
  );
}
