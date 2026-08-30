# Photo Shot List — Café Aux Trois Licornes

Every image slot currently rendered as a placeholder, with the exact filename it expects,
where it appears, and how to shoot/crop it. Drop files into the matching `public/images/*`
folder using the filename below (or update the `src` in the listed source file) and the
placeholder is automatically replaced — no other code changes needed.

General notes:
- Export **WebP** (fallback to high-quality JPEG if WebP isn't available from your camera/editor).
- Every ratio below is the **desktop** crop. Each component also needs to survive being
  cropped tighter on mobile — the "Mobile" line tells you what must stay inside frame.
- Leave genuine negative space where noted — text sits on top of these images.
- Warm, natural light preferred (matches the parchment/espresso palette already in the
  design system). Avoid cool/blue-toned lighting and heavy flash.

---

## Hero

**`public/images/hero/hero-interior.webp`**
- Purpose: Homepage hero background (full-bleed, behind the headline)
- Used in: `src/components/home/hero.tsx`
- Format: Landscape
- Ratio: 16:9 or wider
- Resolution: At least 2400px wide
- Composition: A wide shot of the main room — piano and mismatched seating both help sell
  the vintage/eclectic identity. Leave the **bottom-left third** relatively uncluttered;
  the headline, subtext, and buttons sit there over a dark gradient.
- Mobile: Crops to roughly 4:5 (portrait). Keep the most interesting detail centered
  horizontally so it survives losing both edges.

## Homepage — "Born from a family story"

**`public/images/about/founder-or-team.webp`**
- Purpose: Homepage intro section, opposite the origin-story text
- Used in: `src/components/home/intro.tsx`
- Format: Portrait
- Ratio: 4:5
- Resolution: At least 1600px wide
- Composition: The founder (Matthieu) in the space, candid rather than posed — pulling a
  shot, chatting with a guest, or mid-task. Warm and human, not a corporate headshot.
- Mobile: Full image stays visible (this section stacks to full-width on mobile) — no
  special cropping concerns, but keep the subject centered.

## Café Experience band

**`public/images/interior/ambiance-wide.webp`**
- Purpose: Wide atmosphere shot between the section heading and the three pillars
- Used in: `src/components/home/experience.tsx`
- Format: Landscape, very wide
- Ratio: 21:9
- Resolution: At least 2200px wide
- Composition: A horizontal slice that reads well short-and-wide — a row of seating, the
  train track detail, or a games-in-progress table. This image is hidden on mobile
  (`sm:block`), so don't worry about a portrait crop for it.

## Featured menu (homepage) — 6 square product shots

All six are 1:1, at least 1200px square, shot from directly above or at a slight angle,
consistent lighting/background between them so the row feels like one set. Used in
`src/components/home/featured-menu.tsx`, sourced from `src/lib/menu-data.ts` (the
`slug` there is the filename below). Mobile: center-crop is fine, these are already square.

| Filename | Item |
|---|---|
| `public/images/drinks/cafe-latte.webp` | Café latte |
| `public/images/drinks/cappuccino.webp` | Cappuccino |
| `public/images/food/croissant-jambon-fromage.webp` | Croissant jambon-fromage |
| `public/images/food/wrap-cesar.webp` | Wrap César |
| `public/images/food/sandwich-saumon-fume.webp` | Sandwich saumon fumé |
| `public/images/food/croissant-amandes.webp` | Croissant aux amandes |

*(These same six make excellent candidates to reshoot for the full `/menu` page later if
you decide to add per-item photos there — the data layer already supports an `imageUrl`
per item once the database is seeded.)*

## About page

**`public/images/about/story-detail.webp`**
- Purpose: Opposite the "Trois enfants, un café" story text
- Used in: `src/app/[locale]/a-propos/page.tsx`
- Format: Portrait
- Ratio: 4:5
- Resolution: At least 1600px wide
- Composition: A vintage detail — the toy train, a mismatched chair, a shelf of chosen
  objects. Something that supports "chiné avec soin" (chosen with care) rather than a
  wide room shot (that's already covered by the hero and experience images).
- Mobile: Full width, no special cropping.

**`public/images/team/founder-matthieu.webp`**
- Purpose: Founder portrait, opposite his bio paragraph
- Used in: `src/app/[locale]/a-propos/page.tsx`
- Format: Square
- Ratio: 1:1
- Resolution: At least 1200px square
- Composition: A proper portrait this time (as opposed to the candid intro shot above) —
  still warm, ideally in the space, looking at camera or naturally engaged.
- Mobile: Full width, capped at `max-w-sm` — center-crop is safe.

## Gallery (`/galerie`)

Eight images feeding both the full gallery grid and the homepage gallery preview (which
uses the first six). Ratios are per-item since the gallery is an editorial masonry, not a
uniform grid — matching the ratio keeps the layout from jumping when you swap in real
photos. Used in `src/lib/gallery-data.ts` (add the path to the `src` field once you have
the file) and rendered via `src/app/[locale]/galerie/page.tsx` +
`src/components/home/gallery-preview.tsx`.

| Filename | Subject | Ratio | Resolution |
|---|---|---|---|
| `public/images/gallery/salle-principale.webp` | Main room, wide-ish angle | 4:5 | ≥1600px wide |
| `public/images/gallery/piano.webp` | The piano | 1:1 | ≥1200px square |
| `public/images/gallery/latte-art.webp` | A latte, close-up, good foam art | 4:5 | ≥1600px wide |
| `public/images/gallery/table-de-jeu.webp` | A game table mid-play | 3:2 | ≥1800px wide |
| `public/images/gallery/comptoir-desserts.webp` | The dessert case | 4:5 | ≥1600px wide |
| `public/images/gallery/mur-art.webp` | The 2nd-floor art wall | 3:2 | ≥1800px wide |
| `public/images/gallery/train-miniature.webp` | The toy train, close-up | 1:1 | ≥1200px square |
| `public/images/gallery/facade.webp` | Storefront / exterior signage | 4:5 | ≥1600px wide |

Mobile: the gallery page switches to a single column (full width, native ratio preserved)
and the homepage preview switches to a horizontal swipeable strip at a fixed 4:5 — so for
the two images also used on the homepage (the first six in the table above), make sure the
main subject isn't right at the left/right edge.

---

## How replacement works

`public/images/{hero,interior,menu,drinks,food,gallery,about,team}` already exist, empty,
ready for the files above. Placing a file there isn't quite enough by itself — each
placeholder component (`Photo` / `ImagePlaceholder`) only switches to the real photo once
its `src` prop is set:

- **Gallery** images are the simplest: add the file, then set that item's `src` field in
  `src/lib/gallery-data.ts` to `/images/gallery/<filename>.webp`.
- **Hero, homepage intro, experience band, about page** currently call `Photo`/
  `ImagePlaceholder` without a `src` at all — add one line (`src="/images/..."`) at each
  call site listed above.
- **Featured menu photos** aren't wired to real images yet (the homepage featured-menu
  section always renders the placeholder) — pass `src` through once you're ready to shoot
  product photos, or leave them as placeholders indefinitely; the menu reads fine without
  photos.

This is intentionally a short manual step rather than filename-sniffing magic — it's the
moment to also set a sensible `alt` text and confirm the crop looks right at both mobile
and desktop before shipping the change.
