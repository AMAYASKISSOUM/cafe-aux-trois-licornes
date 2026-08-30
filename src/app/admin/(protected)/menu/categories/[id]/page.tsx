import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { menuCategories } from "@/db/schema";
import { createCategoryAction, updateCategoryAction } from "../../actions";

const fieldClass =
  "h-11 w-full rounded-[var(--radius-sm)] border border-line bg-paper px-3 text-sm text-ink";
const labelClass = "text-xs font-medium uppercase tracking-wide text-ink-faint";

export default async function CategoryFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";

  const category = isNew
    ? null
    : (await getDb().select().from(menuCategories).where(eq(menuCategories.id, id)))[0];

  if (!isNew && !category) notFound();

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="font-display text-2xl text-ink">
        {isNew ? "Nouvelle catégorie" : "Modifier la catégorie"}
      </h1>

      <form action={isNew ? createCategoryAction : updateCategoryAction} className="flex flex-col gap-4">
        {!isNew && <input type="hidden" name="id" value={category!.id} />}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nameFr" className={labelClass}>
            Nom (français)
          </label>
          <input
            id="nameFr"
            name="nameFr"
            required
            defaultValue={category?.nameFr}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nameEn" className={labelClass}>
            Nom (anglais)
          </label>
          <input id="nameEn" name="nameEn" defaultValue={category?.nameEn} className={fieldClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="displayOrder" className={labelClass}>
            Ordre d&apos;affichage
          </label>
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            defaultValue={category?.displayOrder ?? 0}
            className={fieldClass}
          />
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
