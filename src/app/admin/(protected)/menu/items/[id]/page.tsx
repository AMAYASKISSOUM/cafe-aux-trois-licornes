import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { menuCategories, menuItems } from "@/db/schema";
import { createMenuItemAction, updateMenuItemAction } from "../../actions";

const fieldClass =
  "h-11 w-full rounded-[var(--radius-sm)] border border-line bg-paper px-3 text-sm text-ink";
const labelClass = "text-xs font-medium uppercase tracking-wide text-ink-faint";

export default async function MenuItemFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { id } = await params;
  const { categoryId: presetCategoryId } = await searchParams;
  const isNew = id === "new";

  const db = getDb();
  const [categories, item] = await Promise.all([
    db.select().from(menuCategories).orderBy(menuCategories.displayOrder),
    isNew ? Promise.resolve(null) : db.select().from(menuItems).where(eq(menuItems.id, id)).then((r) => r[0]),
  ]);

  if (!isNew && !item) notFound();

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="font-display text-2xl text-ink">{isNew ? "Nouvel item" : "Modifier l'item"}</h1>

      <form action={isNew ? createMenuItemAction : updateMenuItemAction} className="flex flex-col gap-4">
        {!isNew && <input type="hidden" name="id" value={item!.id} />}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="categoryId" className={labelClass}>
            Catégorie
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={item?.categoryId ?? presetCategoryId ?? ""}
            className={fieldClass}
          >
            <option value="" disabled>
              Choisir…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameFr}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nameFr" className={labelClass}>
              Nom (français)
            </label>
            <input id="nameFr" name="nameFr" required defaultValue={item?.nameFr} className={fieldClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nameEn" className={labelClass}>
              Nom (anglais)
            </label>
            <input id="nameEn" name="nameEn" defaultValue={item?.nameEn} className={fieldClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="descriptionFr" className={labelClass}>
              Description (français)
            </label>
            <input
              id="descriptionFr"
              name="descriptionFr"
              defaultValue={item?.descriptionFr ?? ""}
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="descriptionEn" className={labelClass}>
              Description (anglais)
            </label>
            <input
              id="descriptionEn"
              name="descriptionEn"
              defaultValue={item?.descriptionEn ?? ""}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="price" className={labelClass}>
              Prix ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={item ? (item.priceCents / 100).toFixed(2) : undefined}
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="displayOrder" className={labelClass}>
              Ordre
            </label>
            <input
              id="displayOrder"
              name="displayOrder"
              type="number"
              defaultValue={item?.displayOrder ?? 0}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" name="featured" defaultChecked={item?.isFeatured ?? false} className="h-4 w-4" />
            Populaire (mis en vedette)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              name="available"
              defaultChecked={item?.isAvailable ?? true}
              className="h-4 w-4"
            />
            Disponible
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 h-11 w-fit rounded-[var(--radius-sm)] bg-rust px-6 text-sm font-medium text-parchment hover:bg-rust-dark"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
