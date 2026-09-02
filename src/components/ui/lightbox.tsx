"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  src?: string;
  alt: string;
  ratio?: string;
  /** Shared with the grid thumbnail's `layoutId` so opening morphs the clicked photo into place instead of just fading a new one in. */
  slug: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Full-screen image viewer shared by the home gallery preview and the full
 * /galerie page. Owns its own focus/scroll-lock/keyboard handling (same
 * pattern as the mobile nav drawer) so either caller just needs to hand it
 * an image list and the currently-open index.
 *
 * Plain conditional render, not AnimatePresence — a fixed inset-0 backdrop
 * is exactly the wrong element to leave mounted-but-invisible if an exit
 * animation ever fails to signal "done" (it silently blocks every click on
 * the page underneath). Enter still fades in; close is instant.
 */
export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
  labels,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  labels: { close: string; previous: string; next: string };
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const current = open ? images[index] : undefined;

  useEffect(() => {
    if (!open) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    dialogRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && images.length > 1) {
        onNavigate(((index as number) - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight" && images.length > 1) {
        onNavigate(((index as number) + 1) % images.length);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, index, images.length, onClose, onNavigate]);

  if (!open || !current) return null;

  const ratio = current.ratio ?? "4/5";
  const [num, den] = ratio.split("/").map(Number);
  const width = 1000;
  const height = Math.round(width * ((den || 1) / (num || 1)));

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-espresso p-4 outline-none sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label={labels.close}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-espresso-ink-soft transition-colors hover:text-espresso-ink sm:right-6 sm:top-6"
      >
        <X className="h-6 w-6" aria-hidden />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(((index as number) - 1 + images.length) % images.length);
            }}
            aria-label={labels.previous}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-espresso-ink-soft transition-colors hover:text-espresso-ink sm:left-4"
          >
            <ChevronLeft className="h-7 w-7" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(((index as number) + 1) % images.length);
            }}
            aria-label={labels.next}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-espresso-ink-soft transition-colors hover:text-espresso-ink sm:right-4"
          >
            <ChevronRight className="h-7 w-7" aria-hidden />
          </button>
        </>
      )}

      <motion.div
        layoutId={`gallery-photo-${current.slug}`}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {current.src ? (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={width}
            height={height}
            sizes="90vw"
            className="h-auto max-h-[76vh] w-auto max-w-[90vw] object-contain sm:max-w-[85vw]"
          />
        ) : (
          <div className="flex h-[50vh] w-[70vw] max-w-md items-center justify-center bg-espresso-deep text-center text-espresso-ink-soft">
            {current.alt}
          </div>
        )}
      </motion.div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 text-center text-sm text-espresso-ink-soft sm:bottom-6">
        {current.alt}
      </p>
    </motion.div>
  );
}
