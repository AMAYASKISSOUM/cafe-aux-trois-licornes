# Photo Shot List — Café Aux Trois Licornes

## Status update (2026-08-30, later same day): real photos wired in

The owner supplied 27 real photos (from `C:\Users\mayas\Downloads\photo`) plus the
official logo. Every photo was inspected manually; 14 of the 27 are now wired into the
site (some slots were relabeled to honestly match what a photo actually shows, rather
than force it into the original placeholder's caption — noted below). This section
records what actually shipped; the rest of this document is the **original planning
shot list** and is kept for the slots still unfilled (see "Still needed" below).

**Actual mapping used** (source file → destination):

| Source (original filename) | Used for | Real file at |
|---|---|---|
| `logo resturant.png` | Header + footer logo (background removed; a second cream-ink variant generated for the dark footer) | `public/images/brand/logo.png`, `logo-on-dark.png` |
| `photo1.jpeg` | Homepage hero (exterior facade — explicit instruction overrode the original interior-shot plan below) | `public/images/hero/hero-facade.jpg` |
| `IMG_3675.jpeg` (staff at counter) | Homepage intro ("Born from a family story") | `public/images/about/team-counter.jpg` |
| `IMG_3683.jpeg` (piano, pink chair, games cabinet, art) | About page story image | `public/images/about/piano-corner.jpg` |
| `IMG_3677.jpeg` (games cabinet, room) | Homepage experience band **and** gallery (only authentic game-table-adjacent shot; two different crops, two different pages) | `public/images/interior/games-cabinet.jpg` |
| `IMG_3676.jpeg` (latte, leaf art) | Featured menu — café latte | `public/images/drinks/cafe-latte.jpg` |
| `IMG_3684.jpeg` (smoothie) | Gallery (relabeled from "latte-art" — see below) | `public/images/drinks/smoothie.jpg` |
| `IMG_3674.jpeg` (croissant display case) | Featured menu — croissant aux amandes | `public/images/food/croissant-amandes.jpg` |
| `IMG_3686.jpeg` (wrap césar) | Featured menu — wrap césar | `public/images/food/wrap-cesar.jpg` |
| `IMG_3688.jpeg` (smoked salmon sandwich) | Featured menu — sandwich saumon fumé | `public/images/food/sandwich-saumon-fume.jpg` |
| `IMG_3687.jpeg` (crookie) | Gallery (relabeled from "mur-art") | `public/images/food/crookie.jpg` |
| `IMG_3697.jpeg` (main room, art wall) | Gallery — salle principale | `public/images/gallery/salle-principale.jpg` |
| `IMG_3700.jpeg` (piano + ceiling toy train + window) | Gallery — piano | `public/images/gallery/piano.jpg` |
| `IMG_3695.jpeg` (winter exterior, snow) | Gallery — façade | `public/images/gallery/facade.jpg` |
| `IMG_3696.jpeg` (counter, dual pastry cases) | Gallery — comptoir des desserts | `public/images/gallery/comptoir-desserts.jpg` |
| `IMG_3693.jpeg` (standee sign, tagline) | Gallery (relabeled from "train-miniature") | `public/images/gallery/sign-board.jpg` |
| `IMG_3692.jpeg` (counter + chalkboard menu) | `/menu` page header background | `public/images/menu/counter-board.jpg` |

**Gallery labels changed from the original plan** (the photo set had no shot for these
exact subjects — relabeled to honestly describe what's actually shown, per the "editorial
restraint" instruction, rather than caption a photo as something it isn't):
- "Latte art" → **"Notre smoothie maison" / "Our house smoothie"**
- "Table de jeu" (game mid-play) → **"Coin jeux de société" / "Board game corner"**
- "Mur d'art, 2e étage" → **"Une pause gourmande" / "A sweet treat"** (no photo confirms
  which room is the 2nd floor, so the floor-specific claim was dropped, not just the image)
- "Le petit train" → **"L'esprit de la maison" / "The house spirit"**

**Still needed from the owner** (see `docs/PROJECT_STATUS.md`):
- A portrait of Matthieu (the founder) — no photo in the supplied set is verifiably him,
  so both founder-photo slots (`home.intro` can use a team photo instead and does; the
  About page's dedicated founder portrait cannot honestly reuse an unverified face) are
  either filled with a generic team photo or left as placeholder.
- Dedicated product shots for **cappuccino** and **croissant jambon-fromage** — the two
  remaining featured-menu placeholders.

**Not used this pass** (spares, still available in `C:\Users\mayas\Downloads\photo`):
`IMG_3678` (grilled cheese), `IMG_3679`/`IMG_3680` (staff holding Italian/pesto-chicken
sandwiches), `IMG_3681` (cookies), `IMG_3682` (hot drink), `IMG_3689` (chocolate pastries),
`IMG_3690` (grain salad), `IMG_3691` (soup), `IMG_3699` (summer exterior sign). Kept
deliberately unused rather than overloading the site with every available image.

**A real in-café menu board was also photographed** (`IMG_3698.jpeg` — not used as a site
image, but read as a data source) — it differs from `src/lib/menu-data.ts` in ways worth
the owner's attention (new "Croffle" category, several price differences, resolves the
cinnamon-brioche/muffins question from `docs/BUSINESS_RESEARCH.md` §3). Not applied to the
database in this pass — see `docs/PROJECT_STATUS.md`.

---

## Original planning shot list

Every image slot originally rendered as a placeholder, with the exact filename it expects,
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
