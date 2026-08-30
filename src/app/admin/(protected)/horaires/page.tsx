import { isDatabaseConfigured } from "@/db";
import { getWeeklyHours, getSpecialHours } from "@/lib/settings-service";
import { updateWeeklyHoursAction, addSpecialHourAction, deleteSpecialHourAction } from "./actions";

const DAY_LABELS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default async function AdminHoursPage() {
  if (!isDatabaseConfigured()) {
    return <p className="text-sm text-ink-soft">Base de données non configurée.</p>;
  }

  const [weeklyHours, specialHours] = await Promise.all([getWeeklyHours(), getSpecialHours()]);

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-2xl text-ink">Horaires</h1>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg text-ink">Horaire hebdomadaire</h2>
        <form action={updateWeeklyHoursAction} className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-paper">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-line">
              {DAY_LABELS.map((label, day) => {
                const hours = weeklyHours[day as 0 | 1 | 2 | 3 | 4 | 5 | 6];
                const closed = !hours?.open;
                return (
                  <tr key={day}>
                    <td className="px-4 py-3 font-medium text-ink">{label}</td>
                    <td className="px-4 py-3">
                      <label className="flex items-center gap-2 text-xs text-ink-soft">
                        <input type="checkbox" name={`closed-${day}`} defaultChecked={closed} className="h-4 w-4" />
                        Fermé
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        name={`open-${day}`}
                        defaultValue={hours?.open ?? "09:00"}
                        className="h-9 rounded-[var(--radius-sm)] border border-line bg-parchment px-2 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        name={`close-${day}`}
                        defaultValue={hours?.close ?? "17:00"}
                        className="h-9 rounded-[var(--radius-sm)] border border-line bg-parchment px-2 text-sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="border-t border-line p-4">
            <button type="submit" className="h-10 rounded-[var(--radius-sm)] bg-rust px-5 text-sm font-medium text-parchment hover:bg-rust-dark">
              Enregistrer l&apos;horaire
            </button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg text-ink">Fermetures et horaires spéciaux</h2>

        <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-paper">
          {specialHours.length === 0 ? (
            <p className="p-6 text-sm text-ink-faint">Aucune exception à venir.</p>
          ) : (
            <ul className="divide-y divide-line">
              {specialHours.map((s) => (
                <li key={s.date} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {s.date} — {s.isClosed ? "Fermé" : `${s.open} – ${s.close}`}
                    </p>
                    {s.label && <p className="text-xs text-ink-faint">{s.label}</p>}
                  </div>
                  <form action={deleteSpecialHourAction}>
                    <input type="hidden" name="date" value={s.date} />
                    <button type="submit" className="text-xs text-error hover:underline">
                      Supprimer
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form action={addSpecialHourAction} className="grid grid-cols-1 gap-3 rounded-[var(--radius-md)] border border-line bg-paper p-4 sm:grid-cols-5 sm:items-end">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              Date
            </label>
            <input id="date" name="date" type="date" required className="h-9 rounded-[var(--radius-sm)] border border-line bg-parchment px-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="open" className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              Ouverture
            </label>
            <input id="open" name="open" type="time" className="h-9 rounded-[var(--radius-sm)] border border-line bg-parchment px-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="close" className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              Fermeture
            </label>
            <input id="close" name="close" type="time" className="h-9 rounded-[var(--radius-sm)] border border-line bg-parchment px-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="label" className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              Étiquette
            </label>
            <input id="label" name="label" type="text" placeholder="Jour de l'An" className="h-9 rounded-[var(--radius-sm)] border border-line bg-parchment px-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 pb-2 text-xs text-ink-soft">
            <input type="checkbox" name="closed" className="h-4 w-4" defaultChecked />
            Fermé toute la journée
          </label>
          <button
            type="submit"
            className="h-9 rounded-[var(--radius-sm)] border border-ink px-4 text-sm font-medium text-ink sm:col-span-5 sm:w-fit"
          >
            Ajouter
          </button>
        </form>
      </section>
    </div>
  );
}
