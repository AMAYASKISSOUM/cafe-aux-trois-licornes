import Link from "next/link";
import { Plus } from "lucide-react";
import { isDatabaseConfigured } from "@/db";
import { getDb } from "@/db";
import { menuCategories, menuItems } from "@/db/schema";
import { formatPrice } from "@/lib/menu";
import { deleteCategoryAction, deleteMenuItemAction } from "./actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

async function loadMenu() {
  const db = getDb();
  const [categories, items] = await Promise.all([
    db.select().from(menuCategories).orderBy(menuCategories.displayOrder),
    db.select().from(menuItems).orderBy(menuItems.displayOrder),
  ]);
  return { categories, items };
}

export default async function AdminMenuPage() {
  if (!isDatabaseConfigured()) {
    return <p className="text-sm text-ink-soft">Base de données non configurée.</p>;
  }

  let categories: Awaited<ReturnType<typeof loadMenu>>["categories"] = [];
  let items: Awaited<ReturnType<typeof loadMenu>>["items"] = [];
  let loadError = false;
  try {
    ({ categories, items } = await loadMenu());
  } catch (err) {
    console.error("AdminMenuPage failed", err);
    loadError = true;
  }

  if (loadError) {
    return (
      <p className="text-sm text-ink-soft">
        Impossible de charger le menu. Vérifiez les migrations (npm run db:push) et le seed
        (npm run db:seed).
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Menu</h1>
        <Link
          href="/admin/menu/categories/new"
          className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-ink px-4 py-2 text-sm font-medium text-ink"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nouvelle catégorie
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-ink-faint">Aucune catégorie. Créez-en une pour commencer.</p>
      ) : (
        categories.map((cat) => {
          const catItems = items.filter((i) => i.categoryId === cat.id);
          return (
            <section key={cat.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h2 className="font-display text-lg text-ink">
                  {cat.nameFr} <span className="text-sm text-ink-faint">/ {cat.nameEn}</span>
                </h2>
                <div className="flex items-center gap-3 text-sm">
                  <Link href={`/admin/menu/categories/${cat.id}`} className="text-brass-ink hover:underline">
                    Modifier
                  </Link>
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={cat.id} />
                    <ConfirmSubmitButton
                      confirmMessage={`Supprimer la catégorie « ${cat.nameFr} » et tous ses items ?`}
                      className="text-error hover:underline"
                    >
                      Supprimer
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>

              <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-paper">
                {catItems.length === 0 ? (
                  <p className="p-4 text-sm text-ink-faint">Aucun item dans cette catégorie.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {catItems.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-ink">{item.nameFr}</span>
                          {item.isFeatured && (
                            <span className="rounded-full bg-brass/15 px-2 py-0.5 text-[0.6875rem] font-medium uppercase text-brass-ink">
                              Populaire
                            </span>
                          )}
                          {!item.isAvailable && (
                            <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[0.6875rem] font-medium uppercase text-ink-soft">
                              Indisponible
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-ink">{formatPrice(item.priceCents / 100, "fr")}</span>
                          <Link href={`/admin/menu/items/${item.id}`} className="text-brass-ink hover:underline">
                            Modifier
                          </Link>
                          <form action={deleteMenuItemAction}>
                            <input type="hidden" name="id" value={item.id} />
                            <ConfirmSubmitButton
                              confirmMessage={`Supprimer « ${item.nameFr} » ?`}
                              className="text-error hover:underline"
                            >
                              Supprimer
                            </ConfirmSubmitButton>
                          </form>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Link
                href={`/admin/menu/items/new?categoryId=${cat.id}`}
                className="flex w-fit items-center gap-2 text-sm text-brass-ink hover:underline"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Ajouter un item
              </Link>
            </section>
          );
        })
      )}
    </div>
  );
}
