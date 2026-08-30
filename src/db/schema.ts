import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  smallint,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);

/** Singleton row (id = 1) holding editable business info and the reservation policy. */
export const businessSettings = pgTable("business_settings", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  addressStreet: text("address_street").notNull(),
  addressCity: text("address_city").notNull(),
  addressRegion: text("address_region").notNull(),
  addressPostalCode: text("address_postal_code").notNull(),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  reservationsEnabled: boolean("reservations_enabled").notNull().default(true),
  slotLengthMinutes: integer("slot_length_minutes").notNull().default(30),
  defaultDurationMinutes: integer("default_duration_minutes").notNull().default(60),
  maxPartySize: integer("max_party_size").notNull().default(8),
  maxCoversPerSlot: integer("max_covers_per_slot").notNull().default(20),
  minAdvanceNoticeMinutes: integer("min_advance_notice_minutes").notNull().default(60),
  maxAdvanceDays: integer("max_advance_days").notNull().default(60),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Regular weekly schedule — one row per day of week (0 = Sunday .. 6 = Saturday). */
export const openingHours = pgTable(
  "opening_hours",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    dayOfWeek: smallint("day_of_week").notNull(),
    openTime: time("open_time"),
    closeTime: time("close_time"),
  },
  (table) => [uniqueIndex("opening_hours_day_idx").on(table.dayOfWeek)]
);

/** One-off overrides: holidays, exceptional closures, extended/reduced hours. */
export const specialHours = pgTable(
  "special_hours",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    date: date("date").notNull(),
    isClosed: boolean("is_closed").notNull().default(true),
    openTime: time("open_time"),
    closeTime: time("close_time"),
    label: text("label"),
    blocksReservations: boolean("blocks_reservations").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("special_hours_date_idx").on(table.date)]
);

export const menuCategories = pgTable("menu_categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const menuItems = pgTable(
  "menu_items",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => menuCategories.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    nameFr: text("name_fr").notNull(),
    nameEn: text("name_en").notNull(),
    descriptionFr: text("description_fr"),
    descriptionEn: text("description_en"),
    priceCents: integer("price_cents").notNull(),
    imageUrl: text("image_url"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isAvailable: boolean("is_available").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("menu_items_category_idx").on(table.categoryId)]
);

export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  altFr: text("alt_fr").notNull(),
  altEn: text("alt_en").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reservations = pgTable(
  "reservations",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    partySize: smallint("party_size").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    status: reservationStatusEnum("status").notNull().default("pending"),
    notes: text("notes"),
    locale: varchar("locale", { length: 5 }).notNull().default("fr"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("reservations_starts_at_idx").on(table.startsAt),
    index("reservations_status_idx").on(table.status),
    index("reservations_email_idx").on(table.email),
  ]
);
