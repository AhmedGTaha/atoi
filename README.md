# ATOI

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
5. Sign in to `/login` with `INITIAL_ADMIN_EMAIL` /
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

## Database and Prisma Migrations

Prisma uses two different migration commands depending on the environment:

- `prisma migrate dev` is for local development. It creates new migration
  files from schema changes and applies migrations to the local database.
- `prisma migrate deploy` is for production. It only applies migration files
  that already exist in `prisma/migrations/`; it does not create or edit them.

Production commands must use the Vercel **production** environment variables.
Before applying a production migration, check Prisma's datasource output and
verify that the target database is not `localhost`.

### Production Migration on macOS

```bash
cd /Users/ahmed/Developer/atoi

# Install dependencies and generate Prisma client
npm install
npx prisma generate

# Pull production environment variables from Vercel
npx vercel env pull .env.production.local --environment=production

# Check production migration status
npx --yes dotenv-cli -e .env.production.local -- npx prisma migrate status

# Apply all pending migrations to production
npx --yes dotenv-cli -e .env.production.local -- npx prisma migrate deploy

# Verify production database is fully migrated
npx --yes dotenv-cli -e .env.production.local -- npx prisma migrate status
```

Expected final result:

```text
Database schema is up to date!
```

### Production Migration on Windows PowerShell

```powershell
cd C:\Developer\atoi

# Install dependencies and generate Prisma client
npm install
npx prisma generate

# Pull production environment variables from Vercel
npx vercel env pull .env.production.local --environment=production

# Check production migration status
npx --yes dotenv-cli -e .env.production.local -- npx prisma migrate status

# Apply all pending migrations to production
npx --yes dotenv-cli -e .env.production.local -- npx prisma migrate deploy

# Verify production database is fully migrated
npx --yes dotenv-cli -e .env.production.local -- npx prisma migrate status
```

Expected final result:

```text
Database schema is up to date!
```

### Local Development Migration on macOS

These commands use the local `DATABASE_URL`:

```bash
cd /Users/ahmed/Developer/atoi

npx prisma generate
npx prisma migrate status
npx prisma migrate dev
npx prisma migrate status
```

### Local Development Migration on Windows PowerShell

These commands use the local `DATABASE_URL`:

```powershell
cd C:\Developer\atoi

npx prisma generate
npx prisma migrate status
npx prisma migrate dev
npx prisma migrate status
```

### Creating a New Migration

When changing `prisma/schema.prisma` locally, create a new migration with:

```bash
npx prisma migrate dev --name descriptive_migration_name
npx prisma generate
```

Then:

1. Review the generated migration.
2. Test it locally.
3. Commit:
   - `prisma/schema.prisma`
   - The new folder under `prisma/migrations/`
4. Push the changes to GitHub.
5. Apply the migration in production, with the Vercel production environment
   loaded, using:

   ```bash
   npx prisma migrate deploy
   ```

Production must never use:

```bash
npx prisma migrate dev
```

### Important Production Safety Notes

Before applying production migrations, verify that Prisma is not targeting the
local database. If Prisma reports something like:

```text
Datasource "db": PostgreSQL database "atoi", schema "public" at "localhost:5432"
```

then Prisma is connected to the local PostgreSQL database. **Do not run
production migrations against that connection.** Always load the Vercel
production environment before running production migration commands.

Never run the following command against production:

```bash
npx prisma migrate reset
```

Also:

- Do not delete old migration folders after they have been deployed.
- Do not rewrite previously deployed migrations.
- Commit all new migration folders to Git.
- Run `npx prisma migrate status` before deploying.
- Run `npx prisma migrate status` again after deploying.
- Confirm the final result says:

  ```text
  Database schema is up to date!
  ```

### Vercel Setup

The local repository must already be linked to the correct Vercel project. If
it is not linked, run:

```bash
npx vercel link
```

The production database environment variables must also exist in the Vercel
project. Do not add actual database credentials or secrets to this README.

### Recommended Production Workflow

```text
Change Prisma schema locally
        ↓
Create migration with prisma migrate dev
        ↓
Test locally
        ↓
Commit schema + migration folder
        ↓
Push to GitHub
        ↓
Pull Vercel production environment
        ↓
Check prisma migrate status
        ↓
Run prisma migrate deploy
        ↓
Check prisma migrate status again
```

### Prisma Configuration Warning

The project may currently show a Prisma warning similar to:

```text
The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7.
Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
```

This warning does not currently prevent migrations from running. However, the
Prisma configuration should eventually be migrated to `prisma.config.ts`
before upgrading to Prisma 7.

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
