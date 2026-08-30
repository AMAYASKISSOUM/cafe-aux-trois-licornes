import { getDb, isDatabaseConfigured } from "@/db";
import { menuCategories, menuItems } from "@/db/schema";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/lib/menu-data";
import { MENU_ITEM_IMAGES } from "@/lib/menu-images";

export interface MenuItemView {
  id?: string;
  slug: string;
  category: string;
  name: { fr: string; en: string };
  description?: { fr: string; en: string };
  price: number;
  featured?: boolean;
  available?: boolean;
  order: number;
  imageUrl?: string;
}

export interface MenuCategoryWithItems {
  id?: string;
  slug: string;
  name: { fr: string; en: string };
  order: number;
  items: MenuItemView[];
}

async function getMenuFromDb(): Promise<MenuCategoryWithItems[] | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    const db = getDb();
    const categories = await db.select().from(menuCategories).orderBy(menuCategories.displayOrder);
    if (categories.length === 0) return null;
    const items = await db.select().from(menuItems).orderBy(menuItems.displayOrder);

    return categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: { fr: cat.nameFr, en: cat.nameEn },
      order: cat.displayOrder,
      items: items
        .filter((item) => item.categoryId === cat.id && item.isAvailable)
        .map((item) => ({
          id: item.id,
          slug: item.slug,
          category: cat.slug,
          name: { fr: item.nameFr, en: item.nameEn },
          description:
            item.descriptionFr || item.descriptionEn
              ? { fr: item.descriptionFr ?? "", en: item.descriptionEn ?? "" }
              : undefined,
          price: item.priceCents / 100,
          featured: item.isFeatured,
          available: item.isAvailable,
          order: item.displayOrder,
          imageUrl: item.imageUrl ?? MENU_ITEM_IMAGES[item.slug],
        })),
    }));
  } catch (err) {
    console.error("getMenuFromDb: query failed, falling back to static data", err);
    return null;
  }
}

function getMenuFromStatic(): MenuCategoryWithItems[] {
  return MENU_CATEGORIES.slice()
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      order: category.order,
      items: MENU_ITEMS.filter((item) => item.category === category.slug)
        .sort((a, b) => a.order - b.order)
        .map((item) => ({ ...item, available: true, imageUrl: MENU_ITEM_IMAGES[item.slug] })),
    }));
}

/** DB-backed once seeded, with an always-available static fallback — never throws. */
export async function getMenu(): Promise<MenuCategoryWithItems[]> {
  return (await getMenuFromDb()) ?? getMenuFromStatic();
}

export async function getFeaturedMenuItems(limit = 6): Promise<MenuItemView[]> {
  const menu = await getMenu();
  return menu
    .flatMap((category) => category.items)
    .filter((item) => item.featured)
    .slice(0, limit);
}

export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

export function formatPrice(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(amount);
}
