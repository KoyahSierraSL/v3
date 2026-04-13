# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands should be run from the repo root unless noted otherwise.

```bash
pnpm dev          # Start all dev servers (via Turborepo)
pnpm build        # Build all packages and apps
pnpm lint         # Lint all packages and apps
pnpm test         # Run tests across all packages
pnpm typecheck    # Type-check all packages
pnpm clean        # Remove all dist/ outputs
```

To work on only the web app:
```bash
cd apps/web
pnpm dev          # Vite dev server
pnpm lint         # ESLint (flat config + typescript-eslint)
pnpm typecheck    # tsc --noEmit (app + Vite config)
pnpm test:supabase  # Test Supabase connection (requires .env)
```

Lint a single file:
```bash
cd apps/web && npx eslint src/path/to/file.tsx
```

## Architecture

This is a **pnpm + Turborepo monorepo** targeting Vercel deployment.

```
apps/
  web/          # React 19 SPA (Vite) — the primary application
packages/
  shared/       # Shared types, constants, utilities (scaffold only)
  ui/           # Shared component library (scaffold only)
  email-templates/  # Email templates (scaffold only)
```

The three packages under `packages/` are scaffolded but contain no implementation yet.

### TypeScript (monorepo)

- Root [`tsconfig.base.json`](tsconfig.base.json) holds shared strict `compilerOptions` (aligned with KOY-210): `strict`, unused checks, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `moduleResolution: "bundler"`, `isolatedModules`, `noEmit`, etc.
- [`apps/web/tsconfig.json`](apps/web/tsconfig.json) extends the base and adds app-only options (`jsx`, DOM `lib`, `@/*` paths, `allowImportingTsExtensions`, `moduleDetection`). [`apps/web/tsconfig.node.json`](apps/web/tsconfig.node.json) extends the base for `vite.config.ts` (ES2022 lib only).
- Each package under `packages/*` has its own `tsconfig.json` extending the base, `src/index.ts`, and a `typecheck` script. Root [`package.json`](package.json) includes `typescript` for a single obvious version alongside workspace package devDependencies.

### Web App (`apps/web`)

- **React 19 + Vite 8** SPA with **TypeScript** (strict mode, SWC via `@vitejs/plugin-react-swc`)
- Path alias **`@/`** maps to `src/` (see `vite.config.ts` and `tsconfig.json`)
- Currently a **scaffold** — no routing, state management, or real business logic yet
- **Supabase** is the backend: database, auth, and real-time via `@supabase/supabase-js`
- The Supabase client is initialized in `src/lib/supabaseClient.ts` with a `Database` type placeholder in `src/lib/database.types.ts`
  - Exports `supabase` (client instance **or null** if env vars are missing) and `isSupabaseConfigured` (boolean) — callers must check before using
- **Vercel Analytics** and **Speed Insights** are embedded in `src/main.tsx`
- **Styling:** Vanilla CSS with custom properties (CSS variables) and `prefers-color-scheme` dark mode — no Tailwind

### Environment Variables

Copy `apps/web/.env.example` to `apps/web/.env` and fill in Supabase credentials:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=<public anon key>
```

Only `VITE_*` prefixed variables are accessible in browser code. The root `.env.example` also documents Postgres/Supabase service-role variables used at build time and passed through by Turbo.

### Turborepo Task Graph

- `build` depends on upstream `^build` (packages must build before apps)
- `dev` is persistent (long-running)
- Turbo caches `dist/` outputs and watches the root `.env` file as a global dependency

### Vercel Deployment

`vercel.json` at the repo root configures: `pnpm turbo build` as the build command, `apps/web/dist` as the output directory, and `vite` as the framework.

### ESLint

Flat config in `apps/web/eslint.config.js` with **typescript-eslint** (type-aware via `projectService`). `@typescript-eslint/no-unused-vars` ignores variables starting with uppercase (e.g., constants like `API_URL`).

### Package Manager

Uses **pnpm 10** with workspaces. Inter-package dependencies use `workspace:*` protocol. Do not use `npm` or `yarn`.
