import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { BUSINESS } from "../src/lib/business";
import { MENU_CATEGORIES, MENU_ITEMS } from "../src/lib/menu-data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "DATABASE_URL is not set. Run via: npx dotenv -e .env.local -- npx tsx scripts/seed.ts"
    );
    process.exit(1);
  }
  const db = drizzle(neon(url), { schema });

  console.log("Seeding business_settings...");
  await db
    .insert(schema.businessSettings)
    .values({
      id: 1,
      name: BUSINESS.name,
      phone: BUSINESS.phoneDisplay,
      email: BUSINESS.email,
      addressStreet: BUSINESS.address.street,
      addressCity: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      addressPostalCode: BUSINESS.address.postalCode,
      descriptionFr: BUSINESS.description.fr,
      descriptionEn: BUSINESS.description.en,
      facebookUrl: BUSINESS.socials.facebook,
      instagramUrl: BUSINESS.socials.instagram,
    })
    .onConflictDoNothing();

  console.log("Seeding opening_hours...");
  for (const h of BUSINESS.defaultHours) {
    await db
      .insert(schema.openingHours)
      .values({ dayOfWeek: h.day, openTime: h.open, closeTime: h.close })
      .onConflictDoNothing();
  }

  // onConflictDoUpdate keeps the menu in sync with menu-data.ts during development.
  // Once the owner starts editing prices/descriptions from /admin, stop re-running
  // this script (or switch these two to onConflictDoNothing) so it can't clobber
  // their live edits.
  console.log("Seeding menu_categories...");
  const categoryIdBySlug = new Map<string, string>();
  for (const cat of MENU_CATEGORIES) {
    const [row] = await db
      .insert(schema.menuCategories)
      .values({ slug: cat.slug, nameFr: cat.name.fr, nameEn: cat.name.en, displayOrder: cat.order })
      .onConflictDoUpdate({
        target: schema.menuCategories.slug,
        set: { nameFr: cat.name.fr, nameEn: cat.name.en, displayOrder: cat.order },
      })
      .returning({ id: schema.menuCategories.id });
    categoryIdBySlug.set(cat.slug, row.id);
  }

  console.log("Seeding menu_items...");
  for (const item of MENU_ITEMS) {
    const categoryId = categoryIdBySlug.get(item.category);
    if (!categoryId) continue;
    await db
      .insert(schema.menuItems)
      .values({
        categoryId,
        slug: item.slug,
        nameFr: item.name.fr,
        nameEn: item.name.en,
        descriptionFr: item.description?.fr,
        descriptionEn: item.description?.en,
        priceCents: Math.round(item.price * 100),
        isFeatured: Boolean(item.featured),
        displayOrder: item.order,
      })
      .onConflictDoUpdate({
        target: schema.menuItems.slug,
        set: {
          nameFr: item.name.fr,
          nameEn: item.name.en,
          descriptionFr: item.description?.fr,
          descriptionEn: item.description?.en,
          priceCents: Math.round(item.price * 100),
          isFeatured: Boolean(item.featured),
          displayOrder: item.order,
          updatedAt: new Date(),
        },
      });
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
