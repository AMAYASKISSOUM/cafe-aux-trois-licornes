# Deployment

## Current state

- **Vercel project**: linked — `amayaskissoums-projects/cafe-aux-trois-licornes`
- **Production URL**: https://cafe-aux-trois-licornes.vercel.app — **live**
- **Database (Neon)**: **provisioned and live** — schema pushed, seeded with verified
  business data, a real reservation write was tested end-to-end and confirmed in Postgres.
- **Auth (Clerk)**: **provisioned and live** — `clerkMiddleware()` wired into `proxy.ts`,
  `ADMIN_EMAILS` set, a real admin user created and password-auth confirmed working. It's
  a Clerk **Development instance**; promote to Production in the Clerk dashboard when
  ready for real customer-facing use (higher usage limits, removes the "Development mode"
  badge on the sign-in page).
- **Email (Resend)**: **not provisioned** — blocked on owning a custom domain (Resend
  requires DNS TXT/DKIM verification for a domain you control; this project only has the
  default `*.vercel.app` domain so far). This is a business decision (buy a domain) for
  the owner, not something to infer. Reservation emails no-op gracefully with a log line
  in the meantime — confirmed a real reservation still completes successfully without them.

The site is fully deployable and functional in this state: the public site and reservation
system run against the live database, admin auth works, and only outbound email is
pending a domain purchase. See `docs/PROJECT_STATUS.md` for the full picture, including
exactly what was and wasn't independently re-verified after provisioning.

## Provisioning Neon, Clerk, and Resend (Neon + Clerk already done)

Each Vercel Marketplace integration needs a one-time terms acceptance **in a browser**,
which a CLI/agent can't do on your behalf — this was the blocker for Neon and Clerk, now
resolved. To add another integration later (or if starting over on a fresh Vercel
project), open the relevant link, sign in with the Vercel account that owns the project,
and accept:

`vercel.com/<team>/~/integrations/accept-terms/<neon|clerk|resend>`

Then provision (Resend additionally needs a domain you control):

```bash
vercel integration add neon
vercel integration add clerk
vercel integration add resend -m domain=<yourdomain.com> -m region=us-east-1
vercel env pull .env.local
```

`resend` will open a browser for DNS verification — add the TXT/DKIM records it shows at
your domain registrar, wait for verification, then it's ready.

Then apply the schema and seed verified business data (already done for the current
database — only needed again for a fresh one):

```bash
npm run db:push
npm run db:seed
```

And set the admin allowlist (Clerk gives you a user's email after they sign up once):

```bash
vercel env add ADMIN_EMAILS
# comma-separated, e.g. owner@example.com
```

Redeploy after any of the above (`vercel --prod`) so the running deployment picks up the
new environment variables.

## Environment variables

See `.env.example` for the full list with inline comments. Summary:

| Variable | Required for | Source |
|---|---|---|
| `DATABASE_URL` | Reservations, admin dashboard, hours editing | Neon (via Marketplace) |
| `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Admin login | Clerk (via Marketplace); sign-in URL is set to `/admin/sign-in` |
| `ADMIN_EMAILS` | Admin authorization (allowlist) | You choose |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Reservation emails | Resend (via Marketplace) |
| `BLOB_READ_WRITE_TOKEN` | Future image uploads (gallery/menu admin) | `vercel integration add blob` (not yet installed — not needed until upload features are built) |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | Live Google Reviews (optional) | Google Cloud Console — see below |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, OG tags | Your production domain |

**Never commit `.env.local`.** It's already gitignored.

### Live Google Reviews (optional)

The reviews sections work today from a verified static excerpt (see
`docs/BUSINESS_RESEARCH.md`) with zero configuration. To switch to live Google data:

1. In Google Cloud Console, enable the **Places API (New)** and create an API key
   restricted to that API.
2. Resolve the café's Places API `place_id` (its Google Maps CID is already known — see
   `docs/BUSINESS_RESEARCH.md` — but the Places API needs its own `place_id` format,
   obtainable with a one-time `places:searchText` call using the business name + address).
3. Set `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID`.

If either is unset, or the request fails for any reason, the site automatically falls back
to the static excerpt (`src/lib/google-reviews.ts`) — this integration can never break the
reviews sections.

## Database

**Provider**: Neon Postgres, via the Vercel Marketplace (see `vercel-storage` skill notes —
Neon is Vercel's preferred serverless Postgres; it replaced `@vercel/postgres`).

**Free tier** (verify current limits at neon.tech/pricing before relying on this long-term):
at time of writing, Neon's free tier includes 1 project, ~0.5 GB storage, and generous
compute hours suitable for a low-traffic café site. It auto-scales to zero when idle
(cold start on the next request) and does **not** require a credit card to start.

**Production implication**: if traffic grows or the owner wants guaranteed always-on
compute, upgrade to a paid Neon plan directly from the Vercel Marketplace billing page —
no code or connection-string changes needed.

**Migrations**: `src/db/schema.ts` is the source of truth. `npm run db:generate` writes a
SQL migration into `drizzle/`; `npm run db:push` (dev) or applying that migration file
(production, once you want migration history instead of push) updates the database.

**Portability**: the app talks to Postgres through `drizzle-orm/neon-http` +
`@neondatabase/serverless`, both of which work with any standard Postgres connection
string — moving off Neon later (e.g. to Supabase, RDS, or self-hosted Postgres) means
changing `DATABASE_URL` and swapping the driver import in `src/db/index.ts`, not
rewriting the schema or queries.

## Vercel setup (for a fresh clone / new owner)

```bash
npm i -g vercel
vercel login
vercel link            # link to the existing project, or create a new one
vercel env pull .env.local
npm install
npm run dev
```

## Redeployment

Any push to the connected Git branch (once one is connected — see below) triggers a
Vercel deploy automatically. Without Git connected, deploy manually:

```bash
vercel deploy          # preview deployment
vercel deploy --prod   # production deployment
```

## Connecting GitHub (recommended, not yet done)

This project is git-initialized locally but has no GitHub remote yet. To get automatic
preview deployments per pull request and a production deploy on every merge to `main`:

```bash
gh repo create cafe-aux-trois-licornes --private --source=. --remote=origin
git push -u origin master
```

Then in the Vercel dashboard: **Project → Settings → Git** → connect the new repository.

## Domain connection

Once the owner has a domain (or wants to use the free `*.vercel.app` one permanently):

```bash
vercel domains add cafetroislicornes.com
```

Follow the DNS instructions Vercel prints (either delegate nameservers to Vercel, or add
the A/CNAME records it gives you at your registrar). Then set
`NEXT_PUBLIC_SITE_URL=https://cafetroislicornes.com` in the Vercel project's environment
variables and redeploy so canonical URLs and structured data use the real domain.

**This same domain purchase also unblocks Resend** (see the provisioning section above) —
worth doing both at once rather than as two separate trips.

## Ownership transfer checklist

If the café buys this project, everything below can move to accounts they control without
a rebuild:

- [ ] **GitHub repository** — transfer via GitHub's own "Transfer ownership" (Settings →
      General → Danger Zone), or the developer stays a collaborator only as long as needed.
- [ ] **Vercel project** — `vercel.com` → Project Settings → Transfer to another Vercel
      account/team. Marketplace integrations (Neon, Clerk, Resend) transfer with the
      project since they're billed through Vercel.
- [ ] **Domain** — if registered by the developer, transfer the registrar record to the
      owner; if registered by the owner directly, nothing to do.
- [ ] **Neon / Clerk / Resend** — all billed through Vercel Marketplace, so they move
      automatically with the Vercel project transfer above. No separate accounts to hand over.
- [ ] **Google Places API key** (if configured) — was created in a Google Cloud project;
      transfer that Google Cloud project's ownership or issue the owner their own key.
- [ ] **Environment variables** — re-run `vercel env pull` after transfer to confirm the
      new owner's local environment matches production.

Nothing in this codebase is hardcoded to a personal Vercel/GitHub/Google account — every
credential is an environment variable.

## Pre-deploy checklist

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run build`
5. Confirm no secrets in `git status` before committing
6. `vercel deploy --prod`

## Deployment log

**2026-08-30** — First production deploy, then six follow-up fixes from auditing the
live site (Lighthouse + manual testing), each redeployed and reverified.
- URL: **https://cafe-aux-trois-licornes.vercel.app**
- Latest commit: `f7c4c50`
- Status: READY. All routes verified 200 (public pages, both locales, `/reservation`,
  `/admin`, `sitemap.xml`, `robots.txt`, `/icon`); a genuinely unmatched URL correctly
  returns HTTP 404 with branded content. Zero console errors on the live site.
- Fixes made post-first-deploy: WCAG contrast on two text tokens, the `/icon` route
  404ing (proxy matcher gap), an expensive SVG-filter background under CPU throttling, a
  motion-hidden hero LCP element (the serious one — see `docs/QUALITY_AUDIT.md`), and a
  proper branded 404/error/loading state that didn't exist in the first deploy. Final
  measured scores: 100/100/100 (Accessibility/Best Practices/SEO) on every page and
  device tested; Performance 92 desktop / 64-75 mobile depending on page.
- Database/auth/email are not provisioned yet (pending the marketplace terms acceptance
  above), so the site is running in its graceful-fallback state: static menu/hours data,
  reservation form shows the "demo mode" message on submit, `/admin` shows "not
  configured". Once Neon/Clerk/Resend are provisioned and `vercel env pull` + redeploy
  happen, this becomes fully live with no further code changes.

**2026-08-30 (later same day)** — Neon and Clerk provisioned after the owner accepted
marketplace terms; two more fixes and a live end-to-end test.
- Neon: schema pushed (`drizzle-kit push`), seeded (`npm run db:seed`) — verified by
  direct query (7 opening-hours rows, 7 categories, 45 items, business_settings correct).
- Clerk: provisioned, `ADMIN_EMAILS` set, a real admin user created via the Backend API.
  Found and fixed a real bug this exposed: `/admin` 500'd immediately (`auth()` called
  without `clerkMiddleware()` having run — `proxy.ts`'s matcher excluded `/admin`, which
  was correct *before* Clerk existed but not after). Fixed by wrapping the app in
  `clerkMiddleware()`, protecting `/admin/**` except `/admin/sign-in`. Redeployed,
  reverified: unauthenticated `/admin` now correctly redirects to sign-in, and password
  authentication succeeds for the real admin account.
- **Live reservation test**: submitted a real reservation through the production form —
  confirmed in Postgres with correct data and correct UTC conversion of the Gatineau
  local time. Then seeded a second reservation to fill the same slot to exactly its
  capacity limit and confirmed the aggregate query the capacity check depends on returns
  the right number. Test data deleted afterward.
- Resend: attempted provisioning, blocked on requiring a verified custom domain (see
  Current State above) — this needs the owner to buy/point a domain, so left for later
  rather than guessing a placeholder.
- Latest commit: `693e5f1`. Full current status in `docs/PROJECT_STATUS.md`.
