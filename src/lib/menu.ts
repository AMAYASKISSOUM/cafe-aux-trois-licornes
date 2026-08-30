import { MENU_CATEGORIES, MENU_ITEMS, type MenuCategoryDef, type MenuItemDef } from "@/lib/menu-data";

export interface MenuCategoryWithItems extends MenuCategoryDef {
  items: MenuItemDef[];
}

/** Data-access seam: swap the body for a Drizzle query once the DB is seeded — callers don't change. */
export async function getMenu(): Promise<MenuCategoryWithItems[]> {
  return MENU_CATEGORIES.slice()
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      ...category,
      items: MENU_ITEMS.filter((item) => item.category === category.slug).sort(
        (a, b) => a.order - b.order
      ),
    }));
}

export async function getFeaturedMenuItems(limit = 6): Promise<MenuItemDef[]> {
  return MENU_ITEMS.filter((item) => item.featured).slice(0, limit);
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
