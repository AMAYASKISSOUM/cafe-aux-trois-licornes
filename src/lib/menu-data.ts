/**
 * Verified menu data — source: Uber Eats listing, cross-checked against
 * DoorDash (identical prices on every overlapping item). See
 * docs/BUSINESS_RESEARCH.md. This is the seed input for menu_categories /
 * menu_items once the database exists, and the fallback data layer until
 * then — see src/lib/menu.ts, which is the only place pages should import
 * menu data from.
 *
 * "Brioche à la cannelle" and "Muffins maison" appear on Google Maps'
 * popular-items list but not on either delivery platform's priced menu —
 * omitted here rather than guessing a price. Confirm with the owner.
 */

export type MenuCategorySlug =
  | "sandwichs"
  | "soupes-salades"
  | "cafes"
  | "boissons-glacees"
  | "viennoiseries"
  | "desserts"
  | "boissons";

export interface MenuCategoryDef {
  slug: MenuCategorySlug;
  name: { fr: string; en: string };
  order: number;
}

export interface MenuItemDef {
  slug: string;
  category: MenuCategorySlug;
  name: { fr: string; en: string };
  description?: { fr: string; en: string };
  price: number;
  featured?: boolean;
  order: number;
}

export const MENU_CATEGORIES: MenuCategoryDef[] = [
  { slug: "cafes", name: { fr: "Cafés", en: "Coffee" }, order: 0 },
  { slug: "sandwichs", name: { fr: "Sandwichs", en: "Sandwiches" }, order: 1 },
  {
    slug: "soupes-salades",
    name: { fr: "Soupes et salades du jour", en: "Soup & Salad of the Day" },
    order: 2,
  },
  { slug: "viennoiseries", name: { fr: "Viennoiseries", en: "Pastries" }, order: 3 },
  { slug: "desserts", name: { fr: "Desserts", en: "Desserts" }, order: 4 },
  {
    slug: "boissons-glacees",
    name: { fr: "Breuvages glacés", en: "Iced Beverages" },
    order: 5,
  },
  { slug: "boissons", name: { fr: "À boire", en: "Canned & Bottled Drinks" }, order: 6 },
];

export const MENU_ITEMS: MenuItemDef[] = [
  // Cafés / Coffee
  { slug: "cafe-filtre", category: "cafes", name: { fr: "Café filtre", en: "Filter coffee" }, price: 2.99, order: 0 },
  { slug: "espresso", category: "cafes", name: { fr: "Espresso", en: "Espresso" }, price: 3.99, order: 1 },
  { slug: "americano", category: "cafes", name: { fr: "Americano", en: "Americano" }, price: 3.99, order: 2 },
  { slug: "cafe-latte", category: "cafes", name: { fr: "Café latte", en: "Latte" }, price: 5.49, featured: true, order: 3 },
  { slug: "flat-white", category: "cafes", name: { fr: "Flat white", en: "Flat white" }, price: 5.49, order: 4 },
  { slug: "cappuccino", category: "cafes", name: { fr: "Cappuccino", en: "Cappuccino" }, price: 5.49, featured: true, order: 5 },
  { slug: "mocaccino", category: "cafes", name: { fr: "Mocaccino (12 oz)", en: "Mocaccino (12 oz)" }, price: 5.99, order: 6 },
  { slug: "matcha", category: "cafes", name: { fr: "Matcha", en: "Matcha" }, price: 5.99, order: 7 },
  { slug: "dirty-chai", category: "cafes", name: { fr: "Dirty chai", en: "Dirty chai" }, price: 4.99, order: 8 },
  { slug: "chai-latte", category: "cafes", name: { fr: "Chai latte", en: "Chai latte" }, price: 3.99, order: 9 },
  { slug: "the", category: "cafes", name: { fr: "Thé (12/16/20 oz)", en: "Tea (12/16/20 oz)" }, price: 3.99, order: 10 },
  { slug: "london-fog", category: "cafes", name: { fr: "London Fog", en: "London Fog" }, price: 6.29, order: 11 },

  // Sandwichs
  {
    slug: "croissant-jambon-fromage",
    category: "sandwichs",
    name: { fr: "Croissant jambon-fromage", en: "Ham & cheese croissant" },
    description: { fr: "Croissant, jambon, fromage, dijonnaise", en: "Croissant, ham, cheese, dijonnaise" },
    price: 11.99,
    featured: true,
    order: 0,
  },
  {
    slug: "wrap-cesar",
    category: "sandwichs",
    name: { fr: "Wrap César", en: "Caesar wrap" },
    description: { fr: "Tortilla, poulet, bacon, parmesan, romaine, sauce césar", en: "Tortilla, chicken, bacon, parmesan, romaine, caesar sauce" },
    price: 10.99,
    featured: true,
    order: 1,
  },
  {
    slug: "sandwich-dejeuner",
    category: "sandwichs",
    name: { fr: "Sandwich déjeuner", en: "Breakfast sandwich" },
    description: { fr: "Pain croissant, œuf, bacon, cheddar", en: "Croissant bread, egg, bacon, cheddar" },
    price: 10.99,
    order: 2,
  },
  {
    slug: "sandwich-vege",
    category: "sandwichs",
    name: { fr: "Sandwich végé", en: "Veggie sandwich" },
    description: { fr: "Ciabatta, tofu mariné, concombre, carotte, chou, sauce wafu", en: "Ciabatta, marinated tofu, cucumber, carrot, cabbage, wafu sauce" },
    price: 11.99,
    order: 3,
  },
  {
    slug: "grilled-cheese-deluxe",
    category: "sandwichs",
    name: { fr: "Grilled cheese de luxe", en: "Grilled cheese deluxe" },
    description: { fr: "Pain bistro, raclette, oignon caramélisé, bacon", en: "Bistro bread, raclette, caramelized onion, bacon" },
    price: 11.99,
    order: 4,
  },
  {
    slug: "grilled-cheese-3-fromages",
    category: "sandwichs",
    name: { fr: "Grilled cheese 3 fromages", en: "Three-cheese grilled cheese" },
    description: { fr: "Pain bistro, brie, cheddar, provolone", en: "Bistro bread, brie, cheddar, provolone" },
    price: 11.99,
    order: 5,
  },
  {
    slug: "sandwich-saumon-fume",
    category: "sandwichs",
    name: { fr: "Sandwich saumon fumé", en: "Smoked salmon sandwich" },
    description: { fr: "Ciabatta, saumon fumé, fromage à la crème, câpres, oignon mariné", en: "Ciabatta, smoked salmon, cream cheese, capers, marinated onion" },
    price: 12.99,
    featured: true,
    order: 6,
  },
  {
    slug: "sandwich-poulet-pesto",
    category: "sandwichs",
    name: { fr: "Sandwich poulet pesto", en: "Pesto chicken sandwich" },
    description: { fr: "Ciabatta, poulet, mayo-pesto, tomate séchée", en: "Ciabatta, chicken, pesto mayo, sun-dried tomato" },
    price: 12.99,
    order: 7,
  },
  {
    slug: "sandwich-italienne",
    category: "sandwichs",
    name: { fr: "Sandwich Italienne", en: "Italian sandwich" },
    description: { fr: "Salami, capicollo, jambon, provolone, pesto", en: "Salami, capicollo, ham, provolone, pesto" },
    price: 12.99,
    order: 8,
  },
  {
    slug: "burrito-dejeuner",
    category: "sandwichs",
    name: { fr: "Burrito déjeuner", en: "Breakfast burrito" },
    description: { fr: "Tortilla, œuf brouillé, bacon, saucisse, poivron, cheddar, mayo chipotle", en: "Tortilla, scrambled egg, bacon, sausage, pepper, cheddar, chipotle mayo" },
    price: 11.99,
    order: 9,
  },

  // Soupes et salades
  {
    slug: "salade-du-jour",
    category: "soupes-salades",
    name: { fr: "Salade du jour", en: "Salad of the day" },
    description: { fr: "Saveur variable — informez-vous sur place", en: "Flavour varies — ask in café" },
    price: 6.99,
    order: 0,
  },
  {
    slug: "soupe-du-jour",
    category: "soupes-salades",
    name: { fr: "Soupe du jour", en: "Soup of the day" },
    description: { fr: "Saveur variable — informez-vous sur place", en: "Flavour varies — ask in café" },
    price: 6.99,
    order: 1,
  },

  // Viennoiseries
  {
    slug: "crookie",
    category: "viennoiseries",
    name: { fr: "Crookie", en: "Crookie" },
    description: { fr: "Croissant fourré à la pâte à biscuit", en: "Croissant filled with cookie dough" },
    price: 6.99,
    order: 0,
  },
  { slug: "croissant-nutella", category: "viennoiseries", name: { fr: "Croissant au Nutella", en: "Nutella croissant" }, price: 5.99, order: 1 },
  { slug: "croissant-amandes", category: "viennoiseries", name: { fr: "Croissant aux amandes", en: "Almond croissant" }, price: 5.99, featured: true, order: 2 },
  { slug: "croissant-beurre", category: "viennoiseries", name: { fr: "Croissant au beurre", en: "Butter croissant" }, price: 3.99, order: 3 },

  // Desserts
  { slug: "biscuit-choco", category: "desserts", name: { fr: "Biscuit brisures de chocolat", en: "Chocolate chip cookie" }, price: 3.99, featured: true, order: 0 },
  { slug: "carre-dattes", category: "desserts", name: { fr: "Carré aux dattes", en: "Date square" }, price: 5.99, order: 1 },
  { slug: "carre-pommes", category: "desserts", name: { fr: "Carré aux pommes", en: "Apple square" }, price: 9.99, order: 2 },
  {
    slug: "gateau-carottes-caramel",
    category: "desserts",
    name: { fr: "Gâteau au fromage carottes-caramel", en: "Carrot-caramel cheesecake" },
    price: 9.99,
    order: 3,
  },

  // Breuvages glacés
  { slug: "smoothie-mangue", category: "boissons-glacees", name: { fr: "Smoothie à la mangue (20 oz)", en: "Mango smoothie (20 oz)" }, price: 7.99, order: 0 },
  { slug: "smoothie-petits-fruits", category: "boissons-glacees", name: { fr: "Smoothie petits fruits (20 oz)", en: "Mixed berry smoothie (20 oz)" }, price: 7.99, order: 1 },
  { slug: "americano-glace", category: "boissons-glacees", name: { fr: "Americano glacé", en: "Iced Americano" }, price: 5.99, order: 2 },
  { slug: "chai-glace", category: "boissons-glacees", name: { fr: "Chai glacé (20 oz)", en: "Iced chai (20 oz)" }, price: 6.99, order: 3 },
  { slug: "matcha-glace", category: "boissons-glacees", name: { fr: "Matcha glacé (20 oz)", en: "Iced matcha (20 oz)" }, price: 7.49, featured: true, order: 4 },
  { slug: "cappuccino-glace", category: "boissons-glacees", name: { fr: "Cappuccino glacé (20 oz)", en: "Iced cappuccino (20 oz)" }, price: 6.99, order: 5 },
  { slug: "cafe-glace", category: "boissons-glacees", name: { fr: "Café glacé (20 oz)", en: "Iced coffee (20 oz)" }, price: 5.99, order: 6 },

  // À boire
  { slug: "eska", category: "boissons", name: { fr: "Eau pétillante Eska", en: "Eska sparkling water" }, price: 3.49, order: 0 },
  { slug: "pepsi", category: "boissons", name: { fr: "Pepsi", en: "Pepsi" }, price: 3.49, order: 1 },
  { slug: "pepsi-zero", category: "boissons", name: { fr: "Pepsi Zéro", en: "Pepsi Zero" }, price: 3.49, order: 2 },
  { slug: "7up", category: "boissons", name: { fr: "7up", en: "7up" }, price: 3.49, order: 3 },
  { slug: "ginger-ale", category: "boissons", name: { fr: "Ginger ale", en: "Ginger ale" }, price: 3.49, order: 4 },
  { slug: "eau-bouteille", category: "boissons", name: { fr: "Eau embouteillée", en: "Bottled water" }, price: 3.49, order: 5 },
];
