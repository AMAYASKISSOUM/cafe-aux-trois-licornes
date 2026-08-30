export interface GalleryImageDef {
  slug: string;
  label: { fr: string; en: string };
  ratio: string;
  order: number;
  src?: string;
}

/**
 * Placeholder shot list grounded in verified atmosphere details (piano, toy
 * train, 2nd-floor art wall, vintage decor — see docs/BUSINESS_RESEARCH.md).
 * Swap `src` in as real photos arrive; see docs/PHOTO_SHOT_LIST.md.
 */
export const GALLERY_IMAGES: GalleryImageDef[] = [
  { slug: "salle-principale", label: { fr: "Salle principale", en: "Main room" }, ratio: "4/5", order: 0 },
  { slug: "piano", label: { fr: "Le piano", en: "The piano" }, ratio: "1/1", order: 1 },
  { slug: "latte-art", label: { fr: "Latte art", en: "Latte art" }, ratio: "4/5", order: 2 },
  { slug: "table-de-jeu", label: { fr: "Table de jeu", en: "Game table" }, ratio: "3/2", order: 3 },
  { slug: "comptoir-desserts", label: { fr: "Comptoir des desserts", en: "Dessert counter" }, ratio: "4/5", order: 4 },
  { slug: "mur-art", label: { fr: "Mur d'art, 2e étage", en: "Art wall, 2nd floor" }, ratio: "3/2", order: 5 },
  { slug: "train-miniature", label: { fr: "Le petit train", en: "The toy train" }, ratio: "1/1", order: 6 },
  { slug: "facade", label: { fr: "La façade", en: "The storefront" }, ratio: "4/5", order: 7 },
];
