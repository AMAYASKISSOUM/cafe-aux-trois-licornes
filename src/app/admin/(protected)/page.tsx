import { addMinutes } from "date-fns";
import { Link } from "@/i18n/navigation";
import { isDatabaseConfigured } from "@/db";
import { todayKey, toUtcInstant, toZonedHHMM } from "@/lib/availability";
import { getTodayReservationStats, listReservations, type ReservationRow } from "@/lib/reservations-service";
import { formatHour } from "@/lib/hours";
import { StatusBadge } from "@/components/admin/status-badge";

interface DashboardData {
  stats: Awaited<ReturnType<typeof getTodayReservationStats>>;
  upcoming: ReservationRow[];
}

async function loadDashboardData(): Promise<DashboardData | null> {
  const today = todayKey();
  const dayStart = toUtcInstant(today, "00:00");
  const dayEnd = addMinutes(dayStart, 24 * 60);

  try {
    const [stats, upcoming] = await Promise.all([
      getTodayReservationStats(dayStart, dayEnd),
      listReservations({ from: dayStart }),
    ]);
    return { stats, upcoming };
  } catch (err) {
    console.error("AdminDashboardPage: failed to load reservations", err);
    return null;
  }
}

export default async function AdminDashboardPage() {
  if (!isDatabaseConfigured()) {
    return (
      <InfoCard
        title="Base de données non configurée"
        body="Connectez Neon (DATABASE_URL) pour activer le tableau de bord. Voir docs/DEPLOYMENT.md."
      />
    );
  }

  const data = await loadDashboardData();
  if (!data) {
    return (
      <InfoCard
        title="Erreur de chargement"
        body="Impossible de charger les réservations. Vérifiez que les migrations ont été appliquées (npm run db:push)."
      />
    );
  }

  const { stats, upcoming } = data;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl text-ink">Aujourd&apos;hui</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Réservations" value={stats.total} />
        <StatCard label="Convives" value={stats.guests} />
        <StatCard label="En attente" value={stats.pending} />
        <StatCard label="Confirmées" value={stats.confirmed} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">À venir</h2>
          <Link href="/reservation" className="text-sm text-brass-ink hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-paper">
          {upcoming.length === 0 ? (
            <p className="p-6 text-sm text-ink-faint">Aucune réservation à venir.</p>
          ) : (
            <ul className="divide-y divide-line">
              {upcoming.slice(0, 10).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{r.name}</p>
                    <p className="text-xs text-ink-faint">
                      {r.startsAt.toLocaleDateString("fr-CA", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        timeZone: "America/Toronto",
                      })}
                      {" · "}
                      {formatHour(toZonedHHMM(r.startsAt), "fr")}
                      {" · "}
                      {r.partySize} pers.
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-line bg-paper p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-md rounded-[var(--radius-md)] border border-line bg-paper p-6">
      <h1 className="font-display text-xl text-ink">{title}</h1>
      <p className="mt-2 text-sm text-ink-soft">{body}</p>
    </div>
  );
}
