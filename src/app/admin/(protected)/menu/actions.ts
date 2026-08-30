"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { menuCategories, menuItems } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

function revalidateMenu() {
  revalidatePath("/admin/menu");
  revalidatePath("/[locale]", "layout");
}

function parsePriceToCents(raw: FormDataEntryValue | null): number {
  const value = parseFloat(String(raw ?? "0").replace(",", "."));
  return Math.max(0, Math.round((Number.isFinite(value) ? value : 0) * 100));
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const nameFr = String(formData.get("nameFr") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim() || nameFr;
  if (!nameFr) return;

  const db = getDb();
  await db.insert(menuCategories).values({
    slug: slugify(nameFr) || `categorie-${Date.now()}`,
    nameFr,
    nameEn,
    displayOrder: Number(formData.get("displayOrder")) || 0,
  });

  revalidateMenu();
  redirect("/admin/menu");
}

export async function updateCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const nameFr = String(formData.get("nameFr") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim() || nameFr;
  if (!nameFr) return;

  const db = getDb();
  await db
    .update(menuCategories)
    .set({ nameFr, nameEn, displayOrder: Number(formData.get("displayOrder")) || 0, updatedAt: new Date() })
    .where(eq(menuCategories.id, id));

  revalidateMenu();
  redirect("/admin/menu");
}

export async function deleteCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = getDb();
  await db.delete(menuCategories).where(eq(menuCategories.id, id));
  revalidateMenu();
}

export async function createMenuItemAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const nameFr = String(formData.get("nameFr") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim() || nameFr;
  const categoryId = String(formData.get("categoryId") ?? "");
  if (!nameFr || !categoryId) return;

  const db = getDb();
  await db.insert(menuItems).values({
    categoryId,
    slug: `${slugify(nameFr)}-${Date.now().toString(36)}`,
    nameFr,
    nameEn,
    descriptionFr: String(formData.get("descriptionFr") ?? "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
    priceCents: parsePriceToCents(formData.get("price")),
    isFeatured: formData.get("featured") === "on",
    isAvailable: formData.get("available") !== "off",
    displayOrder: Number(formData.get("displayOrder")) || 0,
  });

  revalidateMenu();
  redirect("/admin/menu");
}

export async function updateMenuItemAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const nameFr = String(formData.get("nameFr") ?? "").trim();
  if (!id || !nameFr || !categoryId) return;
  const nameEn = String(formData.get("nameEn") ?? "").trim() || nameFr;

  const db = getDb();
  await db
    .update(menuItems)
    .set({
      categoryId,
      nameFr,
      nameEn,
      descriptionFr: String(formData.get("descriptionFr") ?? "").trim() || null,
      descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
      priceCents: parsePriceToCents(formData.get("price")),
      isFeatured: formData.get("featured") === "on",
      isAvailable: formData.get("available") !== "off",
      displayOrder: Number(formData.get("displayOrder")) || 0,
      updatedAt: new Date(),
    })
    .where(eq(menuItems.id, id));

  revalidateMenu();
  redirect("/admin/menu");
}

export async function deleteMenuItemAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = getDb();
  await db.delete(menuItems).where(eq(menuItems.id, id));
  revalidateMenu();
}
