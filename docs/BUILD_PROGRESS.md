# Build progress and context

Living document for **humans and Cursor agents**: what shipped, what is in flight, and what comes next. Update it when a Linear issue closes, a milestone lands, or infra meaningfully changes—append to **Recent updates** and adjust **Current focus**.

**How to update (agents):** After completing work, add a dated bullet under **Recent updates** (issue ID, short outcome, optional commit SHA). Refresh **Current focus** and **Completed milestones** if scope moved. Do not delete historical entries; strike through only if a decision was reversed.

**Linear project:** [v3](https://linear.app/koyah-sierra/project/v3) (team Koyah Sierra). Cross-reference issue IDs (`KOY-###`) when known.

---

## Snapshot

| Item | State |
|------|--------|
| Monorepo | pnpm 10 + Turborepo 2 |
| Primary app | `apps/web` — React 19, Vite 8, TypeScript strict, `@vitejs/plugin-react-swc` |
| Deploy | Vercel (`vercel.json` → `apps/web/dist`) |
| Backend | Supabase: repo-root `supabase/` (CLI 2.x, `config.toml`, migrations, `seed.sql`); web client in `apps/web/src/lib/supabaseClient.ts`. **Hosted** project in `eu-central-1` + `supabase link` is manual (see README). |
| Packages | `@koyah/shared`, `@koyah/ui`, `@koyah/email-templates` — scaffolds with `typecheck`; no real features yet |

---

## Current focus

<!-- Replace this section when priorities shift. -->

- **Next (typical roadmap):** Design system / UI foundation per Linear (e.g. Tailwind v4, shadcn/ui, TanStack Router)—confirm active issue before implementing.
- **[KOY-211](https://linear.app/koyah-sierra/issue/KOY-211) (In Progress):** Repo-side Supabase CLI scaffold is in place; remaining acceptance criteria are tracked as sub-issues **[KOY-273](https://linear.app/koyah-sierra/issue/KOY-273)** (local Docker smoke: `pnpm db:start`, `apps/web/.env.local`, dev + `test:supabase`) and **[KOY-274](https://linear.app/koyah-sierra/issue/KOY-274)** (hosted `eu-central-1`, email/password Auth, `supabase link`, PITR for prod).
- **No open blocker** for core scripts: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint` succeed from repo root.

---

## Completed milestones

| Milestone | Summary | Linear / notes |
|-----------|---------|------------------|
| Monorepo foundation | pnpm workspaces, Turbo tasks, `apps/web` + `packages/*` layout | KOY-208 Done |
| Web app TypeScript + Vite SWC | Strict TS in `apps/web`, SWC plugin, `@/` alias, Spanish `index.html`, Vercel Analytics/Speed Insights, ESLint + typescript-eslint, Supabase client stub | KOY-209 Done |
| Monorepo-wide TS config | Root `tsconfig.base.json`; `apps/web` + all packages extend base; package `src/index.ts` + `typecheck`; root `typescript` devDep | KOY-210 Done |
| Vite 8 react-swc warning | No-op `useAtYourOwnRisk_mutateSwcOptions` to avoid deprecated top-level `esbuild` JSX path in plugin | Commit `71612ef` |
| Supabase CLI + local dev scaffold (repo) | Root `supabase/` (`config.toml`, initial migration, `seed.sql`), `pnpm db:*` scripts, env examples + README; hosted project + `link` remain manual | [KOY-211](https://linear.app/koyah-sierra/issue/KOY-211) In Progress — follow-ups [KOY-273](https://linear.app/koyah-sierra/issue/KOY-273), [KOY-274](https://linear.app/koyah-sierra/issue/KOY-274) |

---

## Technical foundation (checklist)

Use this to avoid re-discovering decisions.

- [x] Root `tsconfig.base.json` — shared strict options (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `moduleResolution: bundler`, `isolatedModules`, `noEmit`, …).
- [x] `apps/web/tsconfig.json` extends base + DOM, `react-jsx`, `@/*` paths (keep in sync with `vite.config.ts` `resolve.alias`).
- [x] `apps/web/tsconfig.node.json` extends base for `vite.config.ts`.
- [x] `pnpm.onlyBuiltDependencies`: `@swc/core` (root `package.json`) for pnpm 10 install scripts.
- [x] Supabase CLI at repo root: `supabase/config.toml`, `supabase/migrations/`, `supabase/seed.sql`; scripts `pnpm db:start` / `db:stop` / `db:status` / `pnpm supabase` run **`pnpm dlx supabase@2.90.0`** (no `supabase` npm dependency — avoids Vercel `pnpm install` postinstall failures). Requires Docker for local stack.
- [x] TypeScript **5.8.x** (avoid TS 6 `baseUrl`/`paths` deprecation until migrated).
- [x] Turbo: `build`, `lint`, `typecheck`, `dev`, `clean` wired; workspaces define scripts as needed.

---

## Risks and open decisions

| Topic | Note |
|-------|------|
| Package `main` points at `.ts` | Fine for Vite/workspace resolution; revisit if publishing to npm or running Node without a bundler. |
| Scaffold packages | No exports beyond `export {}`; real APIs TBD. |
| Supabase `Database` type | Replace `src/lib/database.types.ts` with generated types when schema exists. |

---

## Recent updates

Newest first.

- **2026-04-13** — Vercel: removed root `supabase` npm package (postinstall binary download failed on build with `Z_DATA_ERROR` / incorrect gzip header). Root `db:*` / `supabase` scripts now use **`pnpm dlx supabase@2.90.0`** so `pnpm install` in CI has no Supabase CLI postinstall.
- **2026-04-13** — [KOY-211](https://linear.app/koyah-sierra/issue/KOY-211) set to **In Progress** on Linear; human/environment work split into [KOY-273](https://linear.app/koyah-sierra/issue/KOY-273) and [KOY-274](https://linear.app/koyah-sierra/issue/KOY-274). `docs/BUILD_PROGRESS.md` updated to match.
- **2026-04-13** — KOY-211 (repo): added Supabase CLI layout (`supabase/`), root `supabase` devDependency + `db:*` scripts, expanded `.env.example` / `apps/web/.env.example`, README Supabase section. Full `supabase start` + `test:supabase` smoke run **not executed here** (Docker daemon unavailable); verify locally with Docker.
- **2026-04-13** — KOY-210 closed: monorepo `tsconfig.base.json`, all workspaces `typecheck`, packages migrated to `index.ts`. Commit `915dc2e`.
- **2026-04-13** — Vite build: silenced `@vitejs/plugin-react-swc` / Vite 8 `esbuild` deprecation via `useAtYourOwnRisk_mutateSwcOptions` no-op. Commit `71612ef`.
- **2026-04-13** — KOY-209 closed: `apps/web` full TS strict scaffold, SWC, ESLint TS, etc. (see Linear / git history on `main`).
