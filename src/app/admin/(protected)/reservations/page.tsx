import Link from "next/link";
import { isDatabaseConfigured } from "@/db";
import { listReservations, type ReservationStatus } from "@/lib/reservations-service";
import { toZonedHHMM, todayKey, toUtcInstant } from "@/lib/availability";
import { formatHour } from "@/lib/hours";
import { StatusBadge } from "@/components/admin/status-badge";
import { ReservationRowActions } from "@/components/admin/reservation-row-actions";
import { cn } from "@/lib/cn";

const STATUS_OPTIONS: { value: ReservationStatus | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "cancelled", label: "Annulée" },
  { value: "completed", label: "Complétée" },
  { value: "no_show", label: "Absence" },
];

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; range?: string }>;
}) {
  if (!isDatabaseConfigured()) {
    return <p className="text-sm text-ink-soft">Base de données non configurée.</p>;
  }

  const { status, search, range } = await searchParams;
  const from = range === "all" ? undefined : toUtcInstant(todayKey(), "00:00");

  let reservations: Awaited<ReturnType<typeof listReservations>> = [];
  let loadError = false;
  try {
    reservations = await listReservations({
      from,
      status: (status as ReservationStatus) || undefined,
      search,
    });
  } catch (err) {
    console.error("AdminReservationsPage failed", err);
    loadError = true;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-ink">Réservations</h1>

      <form className="flex flex-wrap items-end gap-4" method="get">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="search" className="text-xs font-medium uppercase tracking-wide text-ink-faint">
            Rechercher
          </label>
          <input
            id="search"
            name="search"
            type="search"
            defaultValue={search}
            placeholder="Nom ou courriel"
            className="h-10 rounded-[var(--radius-sm)] border border-line bg-paper px-3 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-xs font-medium uppercase tracking-wide text-ink-faint">
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ""}
            className="h-10 rounded-[var(--radius-sm)] border border-line bg-paper px-3 text-sm"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <input type="hidden" name="range" value={range ?? "upcoming"} />
        <button type="submit" className="h-10 rounded-[var(--radius-sm)] border border-ink px-4 text-sm font-medium text-ink">
          Filtrer
        </button>
        <div className="ml-auto flex gap-1 text-sm">
          {[
            { key: "upcoming", label: "À venir" },
            { key: "all", label: "Toutes" },
          ].map((tab) => (
            <Link
              key={tab.key}
              href={{ pathname: "/admin/reservations", query: { range: tab.key, status, search } }}
              className={cn(
                "rounded-[var(--radius-sm)] px-3 py-2",
                (range ?? "upcoming") === tab.key ? "bg-ink text-parchment" : "text-ink-soft hover:bg-parchment"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </form>

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-paper">
        {loadError ? (
          <p className="p-6 text-sm text-ink-soft">
            Impossible de charger les réservations. Vérifiez les migrations (npm run db:push).
          </p>
        ) : reservations.length === 0 ? (
          <p className="p-6 text-sm text-ink-faint">Aucune réservation.</p>
        ) : (
          <ul className="divide-y divide-line">
            {reservations.map((r) => (
              <li key={r.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-ink">{r.name}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-ink-faint">
                    {r.startsAt.toLocaleDateString("fr-CA", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "America/Toronto",
                    })}
                    {" · "}
                    {formatHour(toZonedHHMM(r.startsAt), "fr")}
                    {" · "}
                    {r.partySize} pers. · {r.email} · {r.phone}
                  </p>
                  {r.notes && <p className="text-xs italic text-ink-faint">{r.notes}</p>}
                </div>
                <ReservationRowActions id={r.id} status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
