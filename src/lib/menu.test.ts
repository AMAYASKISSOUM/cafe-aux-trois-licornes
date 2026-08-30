import { describe, expect, it } from "vitest";
import { getMenu, getFeaturedMenuItems, formatPrice, normalizeSearch } from "@/lib/menu";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/lib/menu-data";

describe("getMenu", () => {
  it("groups every item under its category, in category order", async () => {
    const menu = await getMenu();
    expect(menu).toHaveLength(MENU_CATEGORIES.length);
    expect(menu.map((c) => c.slug)).toEqual(
      MENU_CATEGORIES.slice().sort((a, b) => a.order - b.order).map((c) => c.slug)
    );
    const totalItems = menu.reduce((sum, c) => sum + c.items.length, 0);
    expect(totalItems).toBe(MENU_ITEMS.length);
  });

  it("sorts items within a category by display order", async () => {
    const menu = await getMenu();
    for (const category of menu) {
      const orders = category.items.map((i) => i.order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
    }
  });
});

describe("getFeaturedMenuItems", () => {
  it("only returns items flagged featured", async () => {
    const featured = await getFeaturedMenuItems(50);
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((i) => i.featured)).toBe(true);
  });

  it("respects the limit", async () => {
    const featured = await getFeaturedMenuItems(2);
    expect(featured).toHaveLength(2);
  });
});

describe("formatPrice", () => {
  it("formats CAD with two decimals for French Canadian", () => {
    expect(formatPrice(5.5, "fr")).toMatch(/5,50/);
  });

  it("formats CAD with two decimals for English Canadian", () => {
    expect(formatPrice(5.5, "en")).toMatch(/5\.50/);
  });
});

describe("normalizeSearch", () => {
  it("is case- and accent-insensitive", () => {
    expect(normalizeSearch("Café")).toBe(normalizeSearch("cafe"));
    expect(normalizeSearch("MATCHA")).toBe(normalizeSearch("matcha"));
  });

  it("trims whitespace", () => {
    expect(normalizeSearch("  latte  ")).toBe("latte");
  });
});
