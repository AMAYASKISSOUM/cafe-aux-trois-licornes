import { cn } from "@/lib/cn";
import type { ReservationStatus } from "@/lib/reservations-service";

const STYLES: Record<ReservationStatus, string> = {
  pending: "bg-brass/15 text-brass-ink",
  confirmed: "bg-open/25 text-forest",
  cancelled: "bg-error/10 text-error",
  completed: "bg-ink/10 text-ink-soft",
  no_show: "bg-error/15 text-error",
};

const LABELS: Record<ReservationStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  completed: "Complétée",
  no_show: "Absence",
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}
