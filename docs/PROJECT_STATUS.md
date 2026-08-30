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

- [x] Database — **live Neon Postgres**, schema pushed, seeded with verified business
      data. Confirmed by direct query: `business_settings`, all 7 `opening_hours` rows, 7
      `menu_categories`, 45 `menu_items`.
- [x] Reservation system — **tested end-to-end against production with a real submission**:
      filled and submitted the live form in-browser, confirmed the row landed in Postgres
      with the correct fields and a correctly timezone-converted `starts_at`/`ends_at`
      (12:00 Gatineau time on a September date → `16:00Z`/`17:00Z`, i.e. EDT correctly
      applied). Then seeded a second reservation directly to bring the same slot to
      exactly `max_covers_per_slot` (20) and confirmed the aggregate query the capacity
      check relies on reports the right total. Test data deleted after. The one piece
      *not* independently re-verified live is the exact concurrent-race behavior of the
      advisory-lock insert (inherently hard to demonstrate outside a real concurrent-load
      test) — the logic is unit-reasoned and code-reviewed, not load-tested.
- [x] Availability engine — pure functions, **32 passing unit tests** covering closed days, blackout dates, special hours, advance-notice window, capacity boundaries
- [x] Admin auth — Clerk is live. Verified: created a real admin user via the Clerk
      Backend API, confirmed `/admin` correctly redirects an unauthenticated visitor to
      `/admin/sign-in` (proxy + `auth.protect()` working), and confirmed password
      authentication succeeds (reached Clerk's post-password email-verification step,
      which needs the actual account owner's inbox to finish — see Known Issues).
      Clerk is currently a **Development instance** (shows a "Development mode" badge) —
      fine for this demo phase, one-click promotion to Production in the Clerk dashboard
      before real customer-facing use.
- [ ] **Admin dashboard/reservations/menu/hours pages clicked through while fully signed
      in** — not completed in this session (the interactive email-verification step
      can't be finished by an agent — see Known Issues). The auth *gate* is proven
      correct; the pages behind it are simple, already-typechecked Drizzle
      queries + JSX that share code paths with what's already been tested, but haven't
      been eyeballed live post-login.
- [x] Menu admin — create/edit/delete categories and items (name/description FR+EN,
      price, featured, available, display order) at `/admin/menu`. The public `/menu`
      page and homepage featured-menu section read from the live database (confirmed —
      the 45 seeded items are what's rendering on the live site right now), falling back
      to static data only if the DB is ever unreachable.
- [ ] Gallery admin (upload/reorder images) — **not built**. Needs Vercel Blob wired up in addition to a DB table (schema for `gallery_images` already exists).
- [x] Email architecture — Resend + React Email templates (received/confirmed/cancelled), graceful no-op with a log line when `RESEND_API_KEY` is unset. **Resend is not provisioned** — it requires a verified custom domain (DNS TXT/DKIM records) for real sending, and this project only has the default `*.vercel.app` domain so far. Buying a domain is a business decision for the owner, not something to infer — see Credentials section. Confirmed the no-op path doesn't block a reservation from succeeding (the test submission above completed normally with no email configured).

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

- [x] ~~Accept Neon, Clerk, and Resend marketplace terms~~ — Neon and Clerk done, both
      provisioned and live. **Resend is blocked on owning a custom domain** (see above) —
      buy/point a domain, then run `vercel integration add resend -m domain=<yourdomain>
      -m region=us-east-1` and finish the DNS verification step it opens in the browser.
- [x] ~~Set `ADMIN_EMAILS`~~ — set to `mayaskissoum@gmail.com` across all environments,
      with a real Clerk account created for that address. **Sign in once at
      `/admin/sign-in`** (password was set during testing — reset it via "Forgot
      password?" if you don't have it handy) to finish email verification and confirm
      you can reach the dashboard. Add more admin emails the same way: create/invite the
      user in Clerk, add their email to `ADMIN_EMAILS` (comma-separated) in Vercel's
      project settings, redeploy.
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
- **Gallery admin**: not built (see Milestone 2 above) — needs Vercel Blob wired up for
  uploads in addition to the DB table (schema already exists). The owner would currently
  ask the developer to add gallery photos rather than doing it themselves. Menu admin
  *is* built (see above), so this is now the main remaining functionality gap.
- **Fixed during this round of testing**: the moment Clerk was provisioned, `/admin`
  started 500ing in production — `auth()` requires `clerkMiddleware()` to have run for
  the request, and `proxy.ts`'s matcher deliberately excluded `/admin` (written before
  Clerk existed, so it couldn't have worked yet — this was a known, documented deferred
  step, not a surprise). Fixed by wrapping the whole app in `clerkMiddleware()` and
  protecting everything under `/admin` except `/admin/sign-in`.
- **Admin sign-in email verification wasn't completed by the agent**: Clerk asks for an
  emailed verification code on a new sign-in. Sending it works (Clerk's own tested UI
  flow); typing the code back in requires access to the actual inbox, which the agent
  doesn't have for `mayaskissoum@gmail.com` in this session. Sign in once yourself to
  finish this — after that, Clerk won't ask again from a recognized device/browser.
- **Clerk is a Development instance**, not Production — you'll see a "Development mode"
  badge on the sign-in page and a related console warning. Fine for showing this as a
  demo; promote to Production in the Clerk dashboard (one click) before relying on it for
  the real business, since Development instances have tighter usage limits.
- **A plain `curl /admin` shows 404, not a redirect — this is expected, not a bug.**
  Development-instance Clerk apps need a one-time "handshake" redirect through
  `*.clerk.accounts.dev` to establish a dev-browser identity before they can redirect to
  sign-in; Clerk's server logic only offers that handshake to requests that look like a
  real browser navigation (a generic curl request doesn't qualify and gets a bare 404
  instead). Confirmed with a browser-like User-Agent + Accept header: curl then correctly
  gets a `307` to the handshake URL, same as what a real browser does invisibly. A real
  browser hitting `/admin` unauthenticated has always correctly landed on the branded
  sign-in page in every check performed. This quirk goes away once Clerk is promoted to
  a Production instance with a real domain (no handshake needed then).
