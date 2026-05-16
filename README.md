# Twinly

**Give your plant its own digital twin.**

Responsive web app: Next.js 15 · Tailwind · shadcn/ui · Supabase (remote) · Gemini · WeatherAPI.

## Prerequisites

- **Node.js 20+** (see `.nvmrc`)
- Supabase project: `cyvoxtijyntxixeyghnm`
- Team uses the **remote** database only (no local Supabase stack)

## Quick start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` → `.env.local` and fill in keys from [Supabase Dashboard](https://supabase.com/dashboard/project/cyvoxtijyntxixeyghnm/settings/api):

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable / anon)
   - `SUPABASE_SERVICE_ROLE_KEY` (secret — server only)

3. **Supabase MCP (Cursor)**

   This repo pins MCP to the Twinly project in [`.cursor/mcp.json`](.cursor/mcp.json).

   - Open **Cursor Settings → MCP** and ensure the Supabase server is connected (OAuth on first use).
   - Reload the window after cloning so workspace MCP picks up `project_ref=cyvoxtijyntxixeyghnm`.

   Apply the initial schema (once per project):

   - Ask the agent to run `apply_migration` with `supabase/migrations/20260516000000_initial_schema.sql`, or
   - Paste that file into the Supabase SQL editor.

4. **Run dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/                 # App Router routes (skeleton placeholders)
  components/          # UI + layout
  lib/supabase/        # Browser, server, admin, middleware clients
  services/
    geminiService/     # Gemini API (feature milestones)
    weatherService/    # WeatherAPI (feature milestones)
  types/               # Database + PlantReport types
supabase/migrations/   # SQL migrations (source of truth for remote DB)
.cursor/mcp.json       # Supabase MCP → remote project
```

## Routes (skeleton)

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/auth` | Sign in / sign up |
| `/dashboard` | All plants |
| `/plants/new` | Register plant |
| `/plants/[id]` | Plant detail |
| `/plants/[id]/checkin` | Check-in flow |
| `/scan/[id]` | QR → redirects to check-in |
| `/api/*` | API stubs (501 until implemented) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |

## Database

Remote Postgres tables: `users`, `plants`, `checkins`, `analysis_results`, `interventions`.

Storage bucket: `plant-photos` (public).

Regenerate TypeScript types after schema changes (via Supabase MCP `generate_typescript_types`).
