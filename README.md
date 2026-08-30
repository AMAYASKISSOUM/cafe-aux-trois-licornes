# Café Aux Trois Licornes — Website

A bilingual (FR/EN) marketing site, real online reservation system, and admin dashboard
for [Café Aux Trois Licornes](https://maps.app.goo.gl/JUUGdmJxbWsMudvS8), a café / board-game
space in Gatineau, Québec.

Built with Next.js 16 (App Router, Server Components), TypeScript, Tailwind CSS v4,
Drizzle ORM on Neon Postgres, Clerk for admin auth, and Resend for transactional email.

## Documentation

- [`docs/BUSINESS_RESEARCH.md`](docs/BUSINESS_RESEARCH.md) — verified business facts and sources
- [`docs/PHOTO_SHOT_LIST.md`](docs/PHOTO_SHOT_LIST.md) — every photo the site needs, format and composition
- [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) — what's done, what's pending, what needs the owner
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Vercel/Neon/Clerk/Resend setup and ownership transfer
- [`docs/QUALITY_AUDIT.md`](docs/QUALITY_AUDIT.md) — lint/typecheck/test/build results, Lighthouse, known issues

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have — see docs/DEPLOYMENT.md
npm run dev
```

Open http://localhost:3000. The site runs and degrades gracefully with **zero** environment
variables set (menu/hours fall back to verified static data, reservations show a "demo mode"
message instead of erroring, admin shows a "not configured" message instead of crashing).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (availability engine, menu logic, reservation validation) |
| `npm run db:generate` | Generate a Drizzle migration from `src/db/schema.ts` |
| `npm run db:push` | Push the schema straight to the database (dev convenience) |
| `npm run db:seed` | Seed verified business data into the database |
| `npm run db:studio` | Open Drizzle Studio against `.env.local`'s `DATABASE_URL` |

## Project structure

```
src/
  app/
    [locale]/           public site — every page exists in both /fr (default, no prefix) and /en
    admin/              admin dashboard — Clerk-gated, not locale-prefixed
    sitemap.ts, robots.ts, icon.tsx, manifest.ts
  components/
    ui/                 design-system primitives (Button, Container, Photo, Reveal, ...)
    layout/              header, footer, language switch
    home/, menu/, reservation/, admin/
  lib/                   business data, i18n helpers, availability engine, data-access
  db/                    Drizzle schema + lazy client
  emails/                React Email templates
  i18n/                  next-intl routing/navigation config
  messages/               fr.json / en.json translation catalogs
```

Business facts (address, phone, hours, menu, reviews) live in `src/lib/business.ts`,
`src/lib/menu-data.ts`, and `src/lib/reviews.ts` as the seed/fallback source of truth —
see `docs/BUSINESS_RESEARCH.md` for where every value came from.

## Environment variables

See [`.env.example`](.env.example) for the full list and
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for how to obtain each one. Every integration
(database, auth, email, Google Reviews) has a graceful fallback when its env vars are
unset — the app never crashes because a key is missing.

## Tech stack notes

- **Next.js 16** — App Router, Server Components by default, Server Actions for all
  mutations, `proxy.ts` (not `middleware.ts` — renamed in Next 16) for i18n routing.
- **next-intl** — French is the default locale (unprefixed URLs), English lives under
  `/en/...` with fully localized path segments (`/en/about`, `/en/gallery`, etc.).
- **Drizzle ORM + Neon** (`drizzle-orm/neon-http`) — the DB client lazily initializes so
  the app builds and runs without `DATABASE_URL` set.
- **Clerk** — admin authentication, scoped to `/admin` only (not loaded on the public site).
  Authorization is an email allowlist (`ADMIN_EMAILS`), checked in every admin page/action.
- **Resend + React Email** — reservation received/confirmed/cancelled emails; no-ops with a
  log line when `RESEND_API_KEY` is unset.
- **Tailwind CSS v4** — CSS-first config via `@theme` in `src/app/globals.css`; no
  `tailwind.config.js`.
- **motion** (the Framer Motion successor package) — used sparingly for scroll reveals,
  wrapped in a site-wide `MotionConfig reducedMotion="user"` so `prefers-reduced-motion`
  is respected automatically.
