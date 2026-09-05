# Atrio

Bahrain-based software studio platform: a one-page marketing site, a customer
project portal, and an internal admin system — all in a single Next.js app.

See `docs/SRS.md` for the full product specification.

## Stack

- **Next.js (App Router) + TypeScript** for both frontend and backend
  (Server Components, Server Actions, Route Handlers, middleware)
- **PostgreSQL** via **Prisma**
- **Resend** for transactional email
- **Vercel Blob** for persistent image/logo storage
- Custom session auth: **bcryptjs** (password hashing) + **jose** (signed
  session cookies), no third-party auth provider

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local PostgreSQL database and copy `.env.example` to `.env`,
   filling in `DATABASE_URL` and the other variables (see below).
3. Run migrations and seed the first admin + default CMS content:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Sign in to `/admin/login` with `INITIAL_ADMIN_EMAIL` /
   `INITIAL_ADMIN_PASSWORD` from your `.env`.

## Environment variables

See `.env.example` for the full list and descriptions. At minimum you need
`DATABASE_URL`, `APP_URL`, `AUTH_SECRET`, `RESEND_API_KEY` +
`RESEND_FROM_EMAIL`, `BLOB_READ_WRITE_TOKEN`, and
`INITIAL_ADMIN_EMAIL`/`INITIAL_ADMIN_PASSWORD`.

`APP_URL`'s scheme matters: cookies are only marked `Secure` when `APP_URL`
starts with `https://`, so a local `https://` value would prevent the
session cookie from working over plain `http://localhost`. Use
`http://localhost:3000` locally and the real `https://` URL in deployed
environments.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / start |
| `npm run lint` / `npm run typecheck` | Lint / type-check |
| `npm run db:migrate` | Create & apply a Prisma migration (dev) |
| `npm run db:migrate:deploy` | Apply existing migrations (prod/CI) |
| `npm run db:seed` | Seed the first admin + default CMS content |
| `npm run db:studio` | Open Prisma Studio |
| `npm test` | Run unit + integration tests (Vitest, needs a real Postgres DB) |
| `npm run test:e2e` | Seed a dedicated e2e DB and run the Playwright suite |

## Tests

Unit tests are pure functions (no DB). Integration tests exercise the real
service layer against a real Postgres database — point `DATABASE_URL` in
`.env.test` at a disposable database before running `npm test`. E2E tests
in `tests/e2e` run against a production build; configure `.env.e2e`
similarly, then `npm run test:e2e`.

## Deploying to Vercel

1. Provision a Postgres database (Neon, Vercel Postgres, Supabase, etc.)
   and a Vercel Blob store.
2. Set all variables from `.env.example` in the Vercel project settings —
   `APP_URL` must be the real `https://` deployment URL.
3. Run `npm run db:migrate:deploy` against the production database (from
   CI or locally with the production `DATABASE_URL`), then `npm run db:seed`
   once to create the first admin.
4. Deploy. `next build` runs the standard Next.js production build; no
   persistent local filesystem is required anywhere in the app.
