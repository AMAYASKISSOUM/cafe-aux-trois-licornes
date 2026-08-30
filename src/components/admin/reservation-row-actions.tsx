"use client";

import { useTransition } from "react";
import { updateReservationStatusAction } from "@/app/admin/(protected)/reservations/actions";
import type { ReservationStatus } from "@/lib/reservations-service";
import { cn } from "@/lib/cn";

const actionButtonClass =
  "rounded-[var(--radius-sm)] border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-40";

export function ReservationRowActions({ id, status }: { id: string; status: ReservationStatus }) {
  const [isPending, startTransition] = useTransition();

  function set(next: ReservationStatus) {
    startTransition(async () => {
      await updateReservationStatusAction(id, next);
    });
  }

  return (
    <div className={cn("flex flex-wrap gap-2", isPending && "opacity-50")}>
      {status === "pending" && (
        <>
          <button type="button" disabled={isPending} onClick={() => set("confirmed")} className={actionButtonClass}>
            Confirmer
          </button>
          <button type="button" disabled={isPending} onClick={() => set("cancelled")} className={actionButtonClass}>
            Annuler
          </button>
        </>
      )}
      {status === "confirmed" && (
        <>
          <button type="button" disabled={isPending} onClick={() => set("completed")} className={actionButtonClass}>
            Complétée
          </button>
          <button type="button" disabled={isPending} onClick={() => set("no_show")} className={actionButtonClass}>
            Absence
          </button>
          <button type="button" disabled={isPending} onClick={() => set("cancelled")} className={actionButtonClass}>
            Annuler
          </button>
        </>
      )}
      {(status === "cancelled" || status === "no_show") && (
        <button type="button" disabled={isPending} onClick={() => set("pending")} className={actionButtonClass}>
          Réactiver
        </button>
      )}
    </div>
  );
}
