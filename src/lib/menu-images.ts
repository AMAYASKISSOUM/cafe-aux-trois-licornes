/**
 * Real product photos, keyed by menu item slug (see src/lib/menu-data.ts).
 * Applied as a fallback in src/lib/menu.ts so items get a real photo whether
 * they come from the live database (once menu_items.image_url is populated)
 * or the static fallback — without needing a database write for this pass.
 * Only items actually photographed are listed; the rest keep the placeholder.
 */
export const MENU_ITEM_IMAGES: Partial<Record<string, string>> = {
  "cafe-latte": "/images/drinks/cafe-latte.jpg",
  "wrap-cesar": "/images/food/wrap-cesar.jpg",
  "sandwich-saumon-fume": "/images/food/sandwich-saumon-fume.jpg",
  "croissant-amandes": "/images/food/croissant-amandes.jpg",
};
