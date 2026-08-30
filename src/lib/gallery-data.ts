export interface GalleryImageDef {
  slug: string;
  label: { fr: string; en: string };
  ratio: string;
  order: number;
  src?: string;
}

/**
 * Real photos from the café (see docs/PHOTO_SHOT_LIST.md). A few slots were
 * relabeled from the original placeholder shot list to honestly describe
 * the photo actually available rather than force a mismatched caption —
 * e.g. no photo shows a game mid-play, so that slot became the board-game
 * cabinet instead. slugs are kept stable as internal keys.
 */
export const GALLERY_IMAGES: GalleryImageDef[] = [
  {
    slug: "salle-principale",
    label: { fr: "Salle principale", en: "Main room" },
    ratio: "4/5",
    order: 0,
    src: "/images/gallery/salle-principale.jpg",
  },
  {
    slug: "piano",
    label: { fr: "Le piano", en: "The piano" },
    ratio: "1/1",
    order: 1,
    src: "/images/gallery/piano.jpg",
  },
  {
    slug: "latte-art",
    label: { fr: "Notre smoothie maison", en: "Our house smoothie" },
    ratio: "4/5",
    order: 2,
    src: "/images/drinks/smoothie.jpg",
  },
  {
    slug: "table-de-jeu",
    label: { fr: "Coin jeux de société", en: "Board game corner" },
    ratio: "3/2",
    order: 3,
    src: "/images/interior/games-cabinet.jpg",
  },
  {
    slug: "comptoir-desserts",
    label: { fr: "Comptoir des desserts", en: "Dessert counter" },
    ratio: "4/5",
    order: 4,
    src: "/images/gallery/comptoir-desserts.jpg",
  },
  {
    slug: "mur-art",
    label: { fr: "Une pause gourmande", en: "A sweet treat" },
    ratio: "3/2",
    order: 5,
    src: "/images/food/crookie.jpg",
  },
  {
    slug: "train-miniature",
    label: { fr: "L'esprit de la maison", en: "The house spirit" },
    ratio: "1/1",
    order: 6,
    src: "/images/gallery/sign-board.jpg",
  },
  {
    slug: "facade",
    label: { fr: "La façade", en: "The storefront" },
    ratio: "4/5",
    order: 7,
    src: "/images/gallery/facade.jpg",
  },
];
