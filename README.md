# v3 — Koyah monorepo

pnpm + Turborepo monorepo: React 19 + Vite 8 SPA in [`apps/web`](apps/web/), shared packages under [`packages/`](packages/), Vercel deployment.

## Requirements

- [Node.js](https://nodejs.org/) 20+
- [pnpm 10](https://pnpm.io/) (`corepack enable` or install globally)
- [Docker Desktop](https://docs.docker.com/desktop/) — **only if** you run Supabase locally (`pnpm db:start`)
- **Supabase CLI** is **not** an npm dependency (CI/Vercel installs stay lean). Root scripts use **`pnpm dlx supabase@2.90.0`**, which downloads the CLI on first use. Alternatively install the [Supabase CLI](https://supabase.com/docs/guides/cli) globally and run `supabase` directly from the repo root.

## Commands (repo root)

```bash
pnpm install
pnpm dev          # Turbo — all dev tasks
pnpm build
pnpm lint
pnpm typecheck
```

Web app only:

```bash
pnpm --filter @koyah/web dev
pnpm --filter @koyah/web test:supabase   # needs apps/web/.env — see below
```

## Supabase (KOY-211)

### 1. Hosted project (GDPR — EU)

Manual steps (not committed):

1. In [Supabase Dashboard](https://supabase.com/dashboard), create a **new project**.
2. Set region **`eu-central-1`** (Frankfurt).
3. **Authentication → Providers:** enable **Email** (password). Adjust other providers as needed.
4. **Project Settings → API:** copy **Project URL** and **anon public** key.
5. **Production:** consider enabling **PITR** (Point-in-Time Recovery) on a paid plan.

Link the CLI to this project (installs a local link file under `supabase/` — do not commit secrets):

```bash
pnpm supabase login
pnpm supabase link --project-ref <YOUR_PROJECT_REF>
```

`<YOUR_PROJECT_REF>` is the short id in the hosted URL (`https://<ref>.supabase.co`).

### 2. Local stack (Docker)

From the **repository root**:

```bash
pnpm db:start    # supabase start — Postgres, Auth, Storage, Realtime, Studio, Inbucket, etc.
pnpm db:status   # print API URL, anon key, DB URL, Studio URL
pnpm db:stop     # when finished
```

Prerequisites: Docker Desktop running.

Local settings live in [`supabase/config.toml`](supabase/config.toml). Email confirmations for signup are **off** locally (`[auth.email] enable_confirmations = false`) so you can iterate without inbox flow. Test emails appear in **Inbucket** (see `config.toml` / `supabase status` for the mail UI port).

Schema:

- Migrations: [`supabase/migrations/`](supabase/migrations/)
- Seed (runs on `supabase db reset`): [`supabase/seed.sql`](supabase/seed.sql)

### 3. Environment variables for the web app

Vite reads **only** from [`apps/web/`](apps/web/):

1. Copy [`apps/web/.env.example`](apps/web/.env.example) → `apps/web/.env` or `apps/web/.env.local`.
2. For **local** Supabase, use the URL and anon key from `pnpm db:status` (defaults are documented in the example file).
3. For **hosted** Supabase, use the dashboard API URL and anon key (`eu-central-1` project).

Never add `service_role` or secret keys to `VITE_*` variables — they are exposed in the browser bundle.

### 4. Verify connectivity

With `apps/web/.env` filled:

```bash
cd apps/web && pnpm test:supabase
```

## Documentation

- Agent / contributor context: [`CLAUDE.md`](CLAUDE.md)
- Milestone log: [`docs/BUILD_PROGRESS.md`](docs/BUILD_PROGRESS.md)

## License

Private — Koyah Sierra.
