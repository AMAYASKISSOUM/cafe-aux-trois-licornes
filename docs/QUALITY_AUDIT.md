# Quality Audit

Run against the live production deployment — **https://cafe-aux-trois-licornes.vercel.app**
— on 2026-08-30. All numbers below are actual `lighthouse` CLI output (`npx lighthouse ...
--output=json`), not estimates.

## Automated checks

| Check | Result |
|---|---|
| `npm run lint` (ESLint, incl. React Compiler hooks rules) | ✅ Clean |
| `npm run typecheck` (`tsc --noEmit`, strict mode) | ✅ Clean |
| `npm test` (Vitest) | ✅ 32/32 passing |
| `npm run build` (production build) | ✅ Succeeds, all routes generate correctly |

## Lighthouse — final measured scores

| Page | Device | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|---|
| Home | Desktop | **92** | **100** | **100** | **100** | 1.4s | 0 |
| Home | Mobile | **64** | **100** | **100** | **100** | 4.5s | 0 |
| Menu | Mobile | **75** | **100** | **100** | **100** | 2.6s | 0 |
| Reservation | Mobile | **74** | **100** | **100** | **100** | 2.8s | 0.002 |

Accessibility, Best Practices, and SEO are a clean sweep at **100** on every page and
device tested. Performance is strong on desktop and on lighter pages; the homepage on
mobile is the weakest number, explained below.

### What "Mobile" means here

Lighthouse's default mobile run simulates a mid-tier phone on a throttled slow-4G
connection with a **4x CPU slowdown** — deliberately closer to a worst realistic case than
to what most visitors will actually experience on modern LTE/5G. Treat these numbers as a
floor, not a prediction of real-world performance.

### Performance fixes made during this audit (in order)

Lighthouse against the first production deploy started at **49** (mobile, home). Each of
these was found by reading the actual audit output, not guessed:

1. **`text-ink-faint` failed WCAG contrast** (3.64:1 vs the 4.5:1 required) — this alone
   dropped Accessibility to 96. Darkened the token from `#8a7a6c` to `#685844` (6.03:1),
   fixing it sitewide since every "faint" text usage shares the one token.
2. **`/icon` 404'd in production** (best-practices "errors in console") — the i18n proxy's
   matcher excluded paths containing a dot, but Next's generated `icon.tsx` route has no
   extension in its URL. Added `icon`/`apple-icon`/`favicon` to the matcher's exclusions.
3. **Removed the `feTurbulence`-based paper-grain background** — an SVG filter computed
   live by the browser, disproportionately expensive under CPU throttling. Suspected as
   the main-thread "Style & Layout" cost; removed outright rather than approximated.
4. **The big one: motion was hiding the hero's LCP text until JS hydrated.** Framer
   Motion/`motion` bakes its `initial` state inline during SSR — the hero headline's
   `<Reveal>` wrapper shipped `opacity: 0` in the server-rendered HTML, so the largest
   contentful element was **literally invisible** until the animation library loaded,
   parsed, and its `whileInView` observer fired. Measured mobile LCP: **6.8-6.9s**. Fixed
   by removing motion from the hero entirely — it's in the initial viewport on every load,
   so a scroll-reveal there was pure downside anyway. This is the fix that mattered most;
   LCP dropped to 4.5-4.9s afterward.
5. **Made `Reveal`/`RevealGroup` hydration-safe everywhere else.** Same underlying issue
   existed on every below-the-fold section — not an LCP risk (out of the initial
   viewport), but a real robustness gap: those sections were invisible until hydration,
   or permanently invisible if JS failed to load. Switched to `useSyncExternalStore` so
   the hidden/animate behavior only activates post-hydration; server-rendered HTML is now
   always fully visible content.
6. **Dropped the unused Fraunces italic font file** — grepped the codebase, confirmed
   italic styling was never actually applied anywhere, cut one whole font download.

### What's left on performance

The homepage's mobile score (64) is the one number below "good." It has substantially more
content and more `Reveal`-animated sections than any other page (menu and reservation both
score 74-75 with the same motion library in play) — the remaining cost is the cumulative
JS parse/hydration weight of `motion` across ~8 section instances, which loads and executes
on every page load regardless of scroll position. Options for a further pass, not done here
given the scope already covered in this session:
- Reduce the number of separately-animated sections (merge adjacent `Reveal` wrappers).
- Code-split `motion` so it isn't part of the main bundle evaluated before first paint.
- Re-measure once real photography replaces the placeholder graphics (fewer/larger
  composited layers from the current diagonal-hatch placeholder pattern, repeated across
  ~15 placeholder instances on the homepage alone, may also be a contributor).

## Manual verification performed

- **Responsive**: checked in-browser at 375px, 390px, 820px, and 1440px. Found and fixed
  a real horizontal-overflow bug (closed mobile drawer inflating `body.scrollWidth` at
  tablet widths — `overflow-x-clip` on `<body>`) and a real layout bug (`backdrop-filter`
  on the header created a new CSS containing block for its `position: fixed` children,
  collapsing the mobile drawer to a sliver instead of full height whenever the header's
  blur was active — fixed by moving the drawer/backdrop out from under the blurred header
  in the DOM). Both confirmed via DOM measurement (`getBoundingClientRect`), not just a
  screenshot.
- **i18n routing**: confirmed the raw internal pathname (e.g. `/en/a-propos`) 307-redirects
  to the canonical localized alias (`/en/about`) rather than serving duplicate content at
  both URLs.
- **Reservation flow**: filled and submitted the live form end-to-end in-browser (date →
  real generated time slots → contact fields → consent → submit). Confirmed the honest
  "demo mode" message appears instead of a fake success state, since the database isn't
  provisioned yet — this is the intended, designed behavior, not a bug.
- **Mobile nav**: opened/closed via real clicks, confirmed `aria-expanded`, focus moves
  into the panel on open and back to the trigger on Escape, `inert` applied when closed.
- **Google Maps embed**: confirmed it actually renders map tiles (not just a blank iframe)
  on `/contact` and the homepage location section.
- **Sitemap**: fetched `/sitemap.xml` from production, confirmed URLs use the real
  production domain (via `VERCEL_PROJECT_PRODUCTION_URL`, not a hardcoded value) and
  hreflang alternates point at the correct localized paths.

## Update: live database + auth testing (2026-08-30, later same day)

Neon and Clerk were provisioned after this audit's first pass. Re-tested against
production with real credentials rather than re-running the demo-mode checks above:

- **Reservation insert path**: submitted a real reservation through the live form.
  Confirmed in Postgres — correct fields, and `starts_at`/`ends_at` correctly converted
  from Gatineau local time to UTC (12:00 local in September → `16:00Z`, i.e. EDT
  correctly applied, not a fixed UTC offset). Then seeded a second row directly to bring
  that slot's total to exactly `max_covers_per_slot` and confirmed the SQL aggregate the
  capacity check reads from reports the right number. Test rows deleted after.
- **Admin auth**: created a real Clerk user via the Backend API, confirmed an
  unauthenticated visit to `/admin` redirects to `/admin/sign-in` (this exposed a real
  bug — see below), and confirmed password authentication succeeds. Did not complete the
  post-password email-verification step (needs the actual account owner's inbox, not
  available to the agent) or click through the dashboard while fully signed in.
- **Bug found and fixed**: the moment Clerk went live, `/admin` started 500ing —
  `auth()` requires `clerkMiddleware()` to have run for the request, and `proxy.ts`'s
  matcher still excluded `/admin` (correct before Clerk existed, stale after). Fixed,
  redeployed, reverified.
- **Not yet independently verified**: the advisory-lock insert's behavior under genuine
  *concurrent* load (two requests racing for the same slot at the same instant) — the
  test above confirms the aggregate math is correct, not the lock's race behavior, which
  is inherently hard to demonstrate outside a real concurrency test. Admin
  dashboard/reservations/menu/hours pages rendering correctly while fully signed in.
  Resend email sending (blocked on a domain purchase — see `docs/DEPLOYMENT.md`). Live
  Google Reviews adapter (falls back to verified static data, by design, until an API key
  exists).

## Security review

- Every mutation validated server-side with Zod (reservation form; the schema is rebuilt
  server-side from live policy, never trusts a client-sent max-party-size).
- All SQL is parameterized — Drizzle's query builder throughout, plus the one raw
  `sql` template (the atomic capacity-check insert) which uses tagged-template
  interpolation, not string concatenation.
- Reservation submission: rate-limited (5 per 10 minutes per IP) and honeypot-protected.
- Every admin Server Action re-checks `requireAdmin()` independently — not just the
  layout — per Next's own guidance that Proxy/middleware alone isn't sufficient
  authorization (a matcher change could silently stop covering a route).
- Admin routes are `force-dynamic`; never statically cached.
- No secret ever has a `NEXT_PUBLIC_` prefix except Clerk's publishable key, which is
  designed to be public.
- Errors are logged server-side (`console.error`) and returned to the client as a generic
  error code, never a stack trace or raw DB error message.
- Security headers set: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Not done**: a strict Content-Security-Policy. Deliberately deferred — Clerk, the
  Google Maps embed, and Resend each have real script/frame requirements only fully known
  once those integrations are live; shipping a CSP now risks silently breaking one of them
  with no way to verify it before those credentials exist. Documented as a follow-up in
  `docs/PROJECT_STATUS.md`.

## Visual audit

Looked at the actual rendered site (not just code) on every public page, at mobile and
desktop widths: homepage, menu, about, gallery, reviews, contact, reservation. Spacing,
type scale, and the parchment/espresso/rust palette read as consistent and intentional
across pages. The editorial mosaic gallery and the list-style menu (rather than a repeated
photo-card grid) were specifically chosen to avoid the "generic template" look the brief
warned against — confirmed in-browser that they read that way rather than just in theory.
