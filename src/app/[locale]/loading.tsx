import { TrioMark } from "@/components/ui/mark";

/**
 * Shown during a client-side navigation whenever the destination route's
 * data fetch (menu items from the DB, reviews from the API/static
 * fallback) takes long enough for Next to suspend. Previously a small
 * glyph easy to miss entirely at a glance — on a slow fetch that read as
 * "nothing happened" rather than "loading." Sized and labeled so a pause
 * on navigation always reads as intentional.
 */
export default function Loading() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-3 py-40"
      role="status"
      aria-label="Chargement"
    >
      <TrioMark className="h-9 w-14 animate-pulse text-brass" />
      <span className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-ink-faint">
        Chargement…
      </span>
    </div>
  );
}
