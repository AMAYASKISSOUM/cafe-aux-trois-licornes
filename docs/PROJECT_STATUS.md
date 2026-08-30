# Project Status

Last updated: 2026-08-30. Checkboxes are only checked when the thing actually works, not
when the code merely exists — see the notes under each for what "works" means here.

## Milestone 1 — Public website

- [x] Design system (tokens, type scale, Fraunces/Work Sans, motion language) — `src/app/globals.css`
- [x] Global shell — header (desktop + accessible mobile drawer), footer, skip link
- [x] Homepage — hero, intro, featured menu, experience, gallery preview, reviews, reservation CTA, location
- [x] `/menu` — full priced menu, category quick-nav, live search (accent-insensitive)
- [x] `/a-propos`, `/galerie`, `/avis`, `/contact`, `/confidentialite` — all built, real content
- [x] FR/EN — French default (unprefixed), English at localized paths (`/en/about`, `/en/gallery`, ...); verified the raw internal path 307-redirects to the canonical localized alias (no duplicate-content URLs)
- [x] Motion pass — scroll reveals on homepage sections, respects `prefers-reduced-motion` via `MotionConfig`
- [x] Responsive — visually checked at 375px, 390px, 800px, 1440px in-browser; no horizontal overflow (one real bug found and fixed — see Known Issues)
- [x] SEO — per-page metadata + hreflang alternates, `sitemap.ts`, `robots.ts`, generated OG image, generated favicon, `CafeOrCoffeeShop` + `Menu` JSON-LD

## Milestone 2 — Functional system

- [x] Database schema — `src/db/schema.ts` (Drizzle), lazy client, never crashes the build without `DATABASE_URL`
- [x] Reservation system — multi-field form, server-side Zod validation, atomic capacity-safe insert (Postgres advisory lock + single-statement conditional insert), rate limiting, honeypot
- [x] Availability engine — pure functions, **32 passing unit tests** covering closed days, blackout dates, special hours, advance-notice window, capacity boundaries
- [ ] **Reservation system tested against a live database** — the form, validation, and demo-mode fallback are verified working end-to-end in-browser; the actual insert path, capacity enforcement, and email sends have **not** been exercised against a real Postgres instance yet, because Neon isn't provisioned (see below). Code review confidence is high; this is not the same as verified.
- [x] Admin — Clerk-gated `/admin`, dashboard (today's stats + upcoming), reservations list (filter/search/status actions), hours editor (weekly schedule + special/holiday hours)
- [ ] **Admin tested against a live login** — cannot be exercised until Clerk is provisioned; the "not configured" fallback state is verified working.
- [ ] Menu admin (create/edit/delete/reorder items & categories) — **not built**. Menu content today is edited by hand in `src/lib/menu-data.ts` and reseeded. Reasonable next step once the DB is live; deferred in favor of finishing reservations + auth first, per the requested priority order.
- [ ] Gallery admin (upload/reorder images) — **not built**, same reasoning. Needs Vercel Blob wired up in addition to a DB table (schema for `gallery_images` already exists).
- [x] Email architecture — Resend + React Email templates (received/confirmed/cancelled), graceful no-op with a log line when `RESEND_API_KEY` is unset. **Not yet sent for real** — needs Resend provisioned.

## Milestone 3 — Polish

- [x] Accessibility — semantic landmarks, skip link, focus-visible styling sitewide, mobile drawer has focus trap + Escape-to-close + returns focus to trigger + `inert` when closed, form labels/`aria-*` on the reservation form, heading hierarchy checked per page
- [x] Security — Zod validation on every mutation, parameterized SQL throughout (including the raw advisory-lock statement), rate limiting + honeypot on reservations, admin authorization re-checked in every admin Server Action (not just the layout), security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
- [ ] Strict Content-Security-Policy — intentionally not added yet; see Known Issues.
- [x] Tests — 32 Vitest tests (availability engine, menu data logic, reservation schema validation)
- [x] Lint / typecheck / production build — all clean as of this writing
- [x] Error states — custom branded 404 (`app/global-not-found.tsx`, Next 16's
      experimental `globalNotFound` — verified in production: real HTTP 404 status, not
      just matching content), a route-level error boundary with retry, and a
      dependency-free root fallback for the rare case the layout itself throws. Never
      shows a raw stack trace to the user.
- [x] Lighthouse scores — **measured against the live production deployment**: Accessibility, Best Practices, and SEO are **100/100/100 on every page tested, mobile and desktop**. Performance: 92 desktop / 64 mobile on the homepage, 74-75 mobile on lighter pages. Five real bugs found and fixed via this process (including a serious one — motion was hiding the hero text from first paint). Full detail and honest remaining gaps in `docs/QUALITY_AUDIT.md`.
- [x] Deployment — **live at https://cafe-aux-trois-licornes.vercel.app** (production, verified 200 on every route). See `docs/DEPLOYMENT.md`.

## Credentials / setup needed from you

- [ ] Accept Neon, Clerk, and Resend marketplace terms (three browser clicks — links in `docs/DEPLOYMENT.md`), then re-run the installs so real credentials get provisioned.
- [ ] Set `ADMIN_EMAILS` once you know which email(s) should have admin access.
- [ ] Confirm the Thursday closing-hour conflict (Google says midnight, the café's own site says 5 PM) — currently using the website's version. See `docs/BUSINESS_RESEARCH.md` §3.
- [ ] Confirm the full current in-café menu (two items — cinnamon brioche, homemade muffins — appear on Google but not on either delivery platform, so they were left out rather than guessed).
- [ ] Provide real photography — see `docs/PHOTO_SHOT_LIST.md` for the full shot list; the site is fully navigable with placeholders in the meantime.
- [ ] Everything else flagged in `docs/BUSINESS_RESEARCH.md` §4 (Wi-Fi, allergens, exact parking arrangement, wheelchair accessibility beyond the parking lot, legal business name).

## Known issues

- **Fixed during build, noting for the record**: the mobile nav drawer briefly collapsed to
  a sliver instead of full height whenever the header's blur effect was active, because
  `backdrop-filter` on an ancestor creates a new CSS containing block for `position: fixed`
  descendants. Fixed by moving the drawer/backdrop out from under the blurred header in the
  DOM. Verified with real click interactions and DOM measurements, not just a visual check.
- **Fixed during build**: a closed-but-still-mounted mobile drawer (translated off-screen)
  was inflating `document.body.scrollWidth` on some browsers, causing horizontal overflow
  at tablet widths. Fixed with `overflow-x-clip` on `<body>`.
- **No strict CSP**: a Content-Security-Policy was deliberately left out rather than shipped
  half-verified — Clerk, the Google Maps embed, and Resend all have real script/frame
  requirements that are only fully known once those integrations are live. Adding a CSP
  before then risks silently breaking admin login or the map with no easy way to test it.
  Recommended as a follow-up once all three integrations are confirmed working in production.
- **In-memory rate limiting**: the reservation form's spam protection resets per server
  instance rather than being globally shared. Effective under Vercel Fluid Compute (which
  reuses instances), but not a hard guarantee under high concurrent load. Upstash Redis is
  the documented upgrade path in `docs/DEPLOYMENT.md` if this ever matters at this café's scale.
- **Menu/gallery admin**: not built (see Milestone 2 above) — the owner would currently ask
  the developer to edit `src/lib/menu-data.ts` for a price change rather than doing it
  themselves. This is the most significant functionality gap relative to the original brief.
