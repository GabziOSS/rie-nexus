# [[MONOREPO]] — [[PRODUCT-NAME]]

> Real-time city safety and risk management dashboard for [[TARGET-CITY]], [[TARGET-PROVINCE]], [[TARGET-COUNTRY]] — built in collaboration with [[UNIVERSITY-ABBREV]] [[DEPT-ABBREV]] and the local [[PARTNER-AGENCY-ABBREV]].
>
> All identifiers in this document use `[[TOKENS]]`. See IDENTITY_MAP.md (local-only, never shared with agents) to restore real values.

**Created:** 2026-05-10
**Type:** Application
**Internal Codename:** [[INTERNAL-CODENAME]]
**Stack:** Next.js 16 App Router (scaffold) / TanStack Start (target) + Tailwind CSS v4 + Hono + MapLibre GL JS + SST v4 (AWS)
**Package Managers:** pnpm (v0 repo) / Yarn 4 (monorepo)
**Skill Loadout:** PAUL (managed build), AEGIS (post-build audit)
**Quality Gates:** typecheck, lint, build, determinism checks, acceptance criteria per phase

---

## Identity Masking Protocol

This project is developed using secondary AI agents (secondary Claude instances, Antigravity IDE) that should not receive real identifiers in their context windows.

### Token System

All project documents use `[[TOKEN]]` placeholders from IDENTITY_MAP.md. This covers:
- People: `[[DEV-LEAD]]`, `[[PROJECT-LEAD]]`, `[[PROJECT-LEAD-ROLE]]`
- Institutions: `[[UNIVERSITY]]`, `[[UNIVERSITY-ABBREV]]`, `[[DEPT]]`, `[[DEPT-ABBREV]]`
- Agencies: `[[PARTNER-AGENCY]]`, `[[PARTNER-AGENCY-ABBREV]]`, `[[CITY-GOV]]`
- Geography: `[[TARGET-CITY]]`, `[[TARGET-PROVINCE]]`, `[[TARGET-COUNTRY]]`, `[[CITY-COORDS]]`
- Infrastructure: `[[WEATHER-DEVICE-LABEL]]`, `[[INSTITUTION-DOMAIN]]`, `[[INSTITUTION-EMAIL]]`
- Credentials: `[[MOCK-CREDENTIAL-EMAIL]]`, `[[MOCK-CREDENTIAL-PASS]]`, `[[MOCK-USER-NAME]]`
- Repos: `[[GITHUB-ORG]]`, `[[V0-REPO]]`, `[[MONOREPO]]`, `[[VERCEL-PREVIEW-URL]]`
- Zones: `[[ZONE-01]]` through `[[ZONE-12]]`, `[[DISTRICT-1]]` through `[[DISTRICT-6]]`

### What Goes Into Agent Context

| Document | Safe for agents? | Notes |
|----------|-----------------|-------|
| AGENT_CONTEXT.md | YES | Already fully tokenized |
| EXECUTION_PLAYBOOK.md | YES | Already fully tokenized |
| This PLANNING.md | YES | Fully tokenized |
| IDENTITY_MAP.md | **NEVER** | Contains all real values — local-only |

### Code-Level Masking Gaps

These identifiers exist as compile-time constants in code and need attention:

| Location | Identifier | Risk | Action |
|----------|-----------|------|--------|
| Theme IDs | `calbayog-gov-plus`, `nwssu-academic` | Low — internal constants, not user-facing | Optionally rename to `gov-plus`, `academic`; update all references |
| Zone generators | Real barangay names, centroids | Medium — geographically identifiable | Use `[[ZONE-xx]]` tokens during dev; restore before deploy |
| `sst.config.ts` | `montz.qzz.io` domain | Medium — ties to real infrastructure | Add `[[DEPLOY-DOMAIN]]` token to IDENTITY_MAP.md |
| `sst.config.ts` | `civic-pulse-alpha` app name | Low | Add `[[SST-APP-NAME]]` token |
| `.env.example` | `montz.qzz.io` reference | Medium | Use `[[DEPLOY-DOMAIN]]` token |
| Mock auth | `cdrrmo.gov.ph` email | Medium | Already covered by `[[MOCK-CREDENTIAL-EMAIL]]` |

### Restoration Process

After development is complete, before deployment:
1. Global find-and-replace all `[[TOKENS]]` in generated output files using IDENTITY_MAP.md
2. Restore zone names in mock data generators (centroids and area values are real, keep as-is)
3. Verify mock credentials match what's in auth components
4. Verify `[[WEATHER-DEVICE-LABEL]]` matches the actual WeatherLink station label
5. Update `sst.config.ts` domain to real deployment target

---

## Problem Statement

Emergency coordinators in [[TARGET-CITY]] need real-time situational awareness across 12 zone clusters, aggregating incident data (fire, flood, crime, medical, infrastructure, weather), live weather station readings from a Davis Instruments WeatherLink v2 station, and risk indicators into one actionable interface.

**Who it's for:** [[PARTNER-AGENCY-ABBREV]] coordinators and responders under pressure — not general public, not administrators. The interface is a precision instrument: users need to read a screen fast and act faster.

**Why build vs buy:** No off-the-shelf product combines Philippine-specific DRRM workflows with live weather station integration (WeatherLink v2), barangay-level zone mapping, and the institutional requirements of [[UNIVERSITY-ABBREV]]'s research mandate. Prior attempts ([[ATTEMPT-1]], [[ATTEMPT-2]]) confirmed that SPA-only approaches fail due to WeatherLink's CORS constraints.

**Stakeholders:**
- **Dev lead:** [[DEV-LEAD]] ([[DEV-ROLE]])
- **Project lead:** [[PROJECT-LEAD]] ([[PROJECT-LEAD-ROLE]], [[UNIVERSITY-ABBREV]])
- **Partner agency:** [[PARTNER-AGENCY]], [[TARGET-CITY]]
- **Institution:** [[UNIVERSITY]], [[DEPT]] ([[DEPT-ABBREV]])

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Scaffold app | Next.js 16.1.6 App Router | v0-generated surrogate — disposable after TanStack Start migration |
| Target app | TanStack Start | Already scaffolded in monorepo `apps/web/` |
| Styling | Tailwind CSS v4 (`@theme` blocks) + oklch color model | Dark-mode precision themes; 8 themes, bare oklch channel values |
| UI primitives | Radix UI via `components/ui/` | De facto from v0 sessions — do NOT migrate to base-nova |
| Theme switching | next-themes (`attribute="data-theme"`) | Works; verify config, don't replace |
| Charts | Recharts + custom SVG (gauge, wind-rose, compass) | 16 chart types implemented |
| Maps | MapLibre GL JS + react-map-gl | Open-source, no vendor lock |
| Tables | TanStack Table + TanStack Query | Full sort/filter/export |
| Server proxy | Hono (zero framework imports) | Framework-portable — swap one adapter file |
| API client | ts-rest + HMAC-SHA256 signing | WeatherLink v2 requires server-to-server HMAC |
| Error handling | neverthrow ResultAsync | Until Effect v4 http graduates from unstable |
| State (planned) | Jotai atoms | Not yet wired — TODO annotations in components |
| Deployment | SST v4 via OpenNext → AWS Lambda | Configured; needs adaptation for monorepo |
| Monorepo | Turbo + Yarn 4 | Workspace packages under `repos/civicpulse/` |

### Research Needed
- TanStack Start migration: apps/web/ scaffold exists — viability of porting v0 output needs evaluation
- Effect v4 `http`/`httpapi` graduation from `unstable/` — blocks full adoption

---

## Data Model

### Core Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Incident | id, type, severity, status, zoneId, timestamp, coordinates, responseTimeMinutes | belongs to Zone |
| Zone | id, name, barangay, district, centroid, population, area_km2, riskLevel | has many Incidents; belongs to District |
| District | number, label | has many Zones |
| Metric | key, label, value, delta, unit, thresholds | derived from Incidents |
| WeatherData | windSpeed, windBearing, twhIndex, barometer, tempGrouped, humidity, rain, forecast | standalone; from WeatherLink API |
| MockUser | id, name, email, role, lastLogin, active | standalone (mock auth) |

### Type Enums
- **IncidentType:** fire, flood, crime, medical, infrastructure, weather
- **Severity:** critical, high, medium, low
- **IncidentStatus:** open, in_progress, resolved
- **RiskLevel:** critical, high, medium, low

### Notes
- 500 incidents via seeded PRNG (Mulberry32, seed 20250307) across Jan 2024 – Mar 2025
- 12 zones with geographically real centroids within bounds `[[MAP-BOUNDS-SW]]` to `[[MAP-BOUNDS-NE]]`
- Seasonal patterns: floods peak June–Oct (typhoon season), fire peaks March–May (dry season)
- All mock data must be byte-identical across runs (deterministic)
- `DATA_REGISTRY` maps string keys to pre-generated data for chart block resolution

---

## API Surface

### Auth Strategy
localStorage-based mock auth (lib/auth.tsx) — real auth backend deferred to post-design review.

Mock credentials: `[[MOCK-CREDENTIAL-EMAIL]]` / `[[MOCK-CREDENTIAL-PASS]]`

### Route Groups

| Group | Methods | Auth | Purpose |
|-------|---------|------|---------|
| `/api/weather/current` | GET | none (server-side secrets) | Proxy WeatherLink v2 current conditions |
| `/api/weather/historic` | GET | none | Proxy historic weather data |
| `/api/admin/notifications` | GET, POST, DELETE | admin | In-memory ring buffer (max 100) |

### Architecture
```
Browser → Hono RPC layer (lib/server/app.ts — zero framework imports)
  → ts-rest typed client with HMAC signing (lib/weatherlink/client.ts)
    → WeatherLink v2 API
```

The framework adapter is the only framework-specific server file (4 lines). Migration to TanStack Start requires swapping only this file.

### Error Union (WeatherLink)
- NetworkError → HTTP 502 (retry)
- AuthFailedError → HTTP 502 (no retry — config problem)
- RateLimitedError → HTTP 503 (no retry)
- StationNotFoundError → HTTP 404
- ParseError → HTTP 502
- UpstreamError → HTTP 502 (retry)

---

## Deployment Strategy

### Local Development (scaffold)

```bash
# In monorepo root
yarn install
yarn --filter civicpulse-scaffold dev    # http://localhost:3000
yarn --filter civicpulse-scaffold typecheck
yarn build                                # full monorepo build
```

### Local Development (v0 standalone — until consolidation)

```bash
# In v0-beacon-dashboard-build/
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm build
```

### Environment Variables

| Variable | Scope | Required |
|----------|-------|----------|
| WL_API_KEY | server | Milestone 4+ |
| WL_API_SECRET | server | Milestone 4+ |
| WL_STATION_ID | server | Milestone 4+ |
| NODE_ENV | server | always |
| VITE_MAP_STYLE_URL | client | Milestone 3+ |
| VITE_WL_STATION_ID | client | Milestone 4+ |
| VITE_APP_URL | client | Milestone 4+ |

Validation via `@t3-oss/env-core`. Never access `process.env` or `import.meta.env` directly in components.

### Production
- SST v4 → OpenNext → AWS Lambda
- Region: `ap-southeast-1` (nearest to [[TARGET-COUNTRY]])
- Domain: `[[DEPLOY-DOMAIN]]` via Cloudflare DNS
- Current SST config uses `NEXT_PUBLIC_*` prefix — needs migration to `VITE_*` prefix

---

## Security Considerations

- **Agent context isolation:** Real identifiers never enter secondary agent context windows. All shared documents use `[[TOKENS]]`. IDENTITY_MAP.md is local-only.
- **Auth/Authz:** Mock localStorage auth only — not production-ready. Real backend deferred.
- **WeatherLink secrets:** Server-only, validated via env module. HMAC signing prevents exposure. CORS preflight rejection confirmed empirically during [[ATTEMPT-2]].
- **Input validation:** Zod schemas for WeatherLink responses (strict → loose → warn). Form inputs on ZoneSheet need validation.
- **OWASP concerns:** XSS via chart tooltips (use text content, not innerHTML). No SQL. No mutation endpoints beyond mock auth.
- **Secrets management:** dotenvx encrypted. `.env.example` committed; real values never committed.

---

## UI/UX Needs

### Design Mandate
"Precision instrument — not a website, not an admin panel." Emergency coordinators under pressure. Near-black obsidian-ops default theme with ice-blue primary, like a cardiac monitor or radar return.

### Design System
- Tailwind CSS v4 with `@theme` blocks mapping to oklch CSS variables
- 8 dark-mode themes (obsidian-ops, civicpulse, gov-plus, academic, civic-fusion, terracotta-republic, teal-command, midnight-mono)
- Two-layer CSS: `@theme` for Tailwind utility generation, `[data-theme="..."]` for oklch values
- Mono font (IBM Plex Mono / JetBrains Mono) for all numerical data
- Three depth levels: `--background` → `--card` → `--card-nested`

### Key Views

| View | Purpose | Status |
|------|---------|--------|
| Login | Split layout, mock auth | Shell exists |
| Dashboard Overview | 19-block DnD chart grid | Shell exists, data wiring pending |
| Weather Station | ~14-block weather preset | Shell exists, live data pending |
| Category Views (x6) | Filtered incident views per type | Shell exists |
| Map | MapLibre with 12 zones, clusters, heatmap | Placeholder only |
| Data Table | TanStack Table with sort/filter/export | Shell only |
| Alerts | Alert management | Shell exists |
| Users | User roster | Shell exists |
| Settings | Appearance, Dashboard, Notifications, Data | Shell exists |

### Real-Time Requirements
- WeatherLink polling: 60s refetch, 55s stale time
- `isPlaceholderData` distinguishes mock vs live (MOCK pill indicator)
- No WebSockets — polling sufficient for weather station cadence

### Responsive Needs
Desktop-first. Emergency coordinators use fixed workstations.

---

## Integration Points

| Integration | Type | Purpose | Auth |
|------------|------|---------|------|
| WeatherLink v2 API | REST (server-to-server) | Live weather from [[WEATHER-DEVICE-LABEL]] | HMAC-SHA256 |
| MapLibre tiles | Tile server | Map base layer | Style URL (demo tiles initially) |
| AWS (SST v4) | Production hosting | Lambda via OpenNext | IAM |

### WeatherLink Schema Strategy
```
strict Zod (IssDataSchema, data_structure_type=10)
  → transformIssToCurrentConditions()
  OR loose Zod → manualTransform() + emitParseWarning()
  OR ParseError
```

---

## Phase Breakdown

### Milestone 1: Consolidation

**Goal:** Single working monorepo with the v0 build running as scaffold app.

#### Phase 1.1: Pull v0 Into Monorepo
- **Build:** Copy [[V0-REPO]] source into `repos/civicpulse/apps/scaffold/`. Adapt `package.json` for Yarn workspace. Wire imports to use `@rie-civicpulse/ui` and `@rie-civicpulse/mock-data` where the monorepo libs already have content.
- **Testable:** `yarn --filter civicpulse-scaffold dev` starts at localhost:3000; login page renders; mock auth works; all 19 chart blocks render
- **Outcome:** Single repo, single workspace, v0 build fully operational

#### Phase 1.2: Apply Masking Protocol
- **Build:** Add `[[DEPLOY-DOMAIN]]` and `[[SST-APP-NAME]]` tokens to IDENTITY_MAP.md. Verify `sst.config.ts`, `.env.example`, and any code files use tokens where real identifiers currently appear. Ensure IDENTITY_MAP.md is in `.gitignore`.
- **Testable:** `grep -rn` for real institution names/domains returns zero hits outside `_archived/` and `.gitignore`'d files
- **Outcome:** Codebase safe for secondary agent context

#### Phase 1.3: Verify SST Pipeline
- **Build:** Adapt `sst.config.ts` for monorepo structure — point `buildCommand` to scaffold app's build output. Verify Cloudflare DNS and AWS provider configs. Reconcile `NEXT_PUBLIC_*` → `VITE_*` prefix in SST env config.
- **Testable:** `yarn --filter civicpulse-scaffold build` succeeds; `sst dev` connects to AWS; `sst deploy --stage dev` deploys to `[[DEPLOY-DOMAIN]]`
- **Outcome:** Deployment pipeline restored and verified

**Milestone 1 acceptance:** Scaffold runs locally, builds for production, deploys via SST, no real identifiers in agent-facing files.

---

### Milestone 2: Data Foundation (OC-1 + OC-2)

**Goal:** Deterministic data layer + charts wired to real (mock) data.

#### Phase 2.1: Infrastructure Precursors
- **Build:** `lib/routing.ts` (framework isolation seam), `lib/env.client.ts` + `lib/env.server.ts` (env validation via `@t3-oss/env-core`). Audit and fix all direct `next/*` imports.
- **Testable:** `grep -r "from \"next/navigation\"" --include="*.ts" --include="*.tsx" | grep -v "lib/routing.ts"` returns zero results. Typecheck passes.
- **Outcome:** Clean seam for future TanStack Start migration

#### Phase 2.2: Mock Data Module (OC-1)
- **Build:** `libs/mock-data/src/` — seed.ts (Mulberry32 PRNG, seed 20250307), types.ts, 12 generators, index.ts with DATA_REGISTRY and lookup helpers. See AGENT_CONTEXT.md sections 6.1–6.6 for full spec.
- **Testable:**
  - `INCIDENTS.length === 500`
  - `ZONES.length === 12`
  - All centroids within `[[MAP-BOUNDS-SW]]` to `[[MAP-BOUNDS-NE]]`
  - All GeoJSON polygon rings closed (first coord === last coord)
  - Two consecutive builds produce byte-identical output
- **Outcome:** Deterministic data layer unblocking all subsequent phases
- **Note:** Monorepo already has partial generators in `libs/mock-data/src/generators/` — reconcile, don't duplicate

#### Phase 2.3: Chart Wiring (OC-2)
- **Build:** `lib/chart-colors.ts`, `lib/dashboard-blocks.ts` (reducer), `lib/default-dashboard.ts` (overview + weather_station presets), `lib/hooks/use-chart-data.ts`, weather stubs (`use-weather-live.ts` empty export, `transforms.ts` mock transform only)
- **Testable:**
  - All 19 overview charts render from DATA_REGISTRY
  - All ~14 weather station charts render from DATA_REGISTRY
  - DnD reorder persists across page reload
  - Preset switch persists across reload
  - `grep -r "useCurrentConditions"` returns zero (stub only)
  - No new `Math.random()` outside seed.ts
  - Typecheck passes
- **Outcome:** Charts display real (mock) data; weather components marked for live swap

**Milestone 2 acceptance:** All charts render deterministic data, layout persists, typecheck + lint + build pass.

---

### Milestone 3: Interactive Features (OC-3 + OC-4)

**Goal:** Real data table and real map. Phases 3.1 and 3.2 are **parallel-safe** — no dependencies between them.

#### Phase 3.1: TanStack Table (OC-3)
- **Build:** `incident-table.tsx`, `table-toolbar.tsx`, `row-detail-panel.tsx`, filter controls (multi-select, date-range, number-range). See AGENT_CONTEXT.md section 16 for full spec.
- **Testable:**
  - Multi-column sort (default: timestamp desc)
  - Global search (debounced 300ms, searches id/zoneName/barangay/description)
  - Column filters: type, severity, status (multi-select), date range, responder range
  - Row expansion → RowDetailPanel
  - CSV + JSON export (CSV: visible columns only; JSON: full row.original)
  - Column visibility toggle
  - Default hidden: id, barangay, respondersAssigned
  - Pagination: default 25, options 10/25/50
- **Outcome:** Full data table replacing visual shell
- **Depends on:** Milestone 2

#### Phase 3.2: MapLibre (OC-4)
- **Build:** `city-map.tsx`, `map-controls.tsx`, `zone-sheet.tsx`, `map-popup.tsx`, canvas risk-level patterns (critical/high/medium/low). See AGENT_CONTEXT.md section 11 for full spec.
- **Testable:**
  - Map loads at `[[CITY-COORDS]]`, zoom 12
  - All 12 zones render with risk-level fill patterns
  - Zone click opens ZoneSheet (3 tabs: Details, Timeline, Log Incident)
  - Cluster → unclustered transition at zoom 14
  - Heatmap toggle works
  - `?zone=z01` deep link works on direct page load
  - maxBounds prevents panning out of region
  - Patterns registered after `map.on("load")` (not before)
- **Outcome:** Real interactive map replacing SVG placeholder
- **Depends on:** Milestone 2

**Milestone 3 acceptance:** Table and map fully functional, all acceptance criteria verified, typecheck + lint + build pass.

---

### Milestone 4: Live Integration (OC-5)

**Goal:** Replace mock weather data with live WeatherLink v2 station data.

**Precondition:** Milestones 2–3 stable. This milestone is optional — only attempt when everything else is solid.

#### Phase 4.1: WeatherLink Server Layer
- **Build:**
  - `lib/weatherlink/auth.ts` — HMAC-SHA256 signing
  - `lib/weatherlink/client.ts` — ts-rest typed client
  - `lib/weatherlink/service.ts` — neverthrow ResultAsync service
  - `lib/weatherlink/schema.ts` — Zod schemas (strict + loose)
  - `lib/weatherlink/transforms.ts` — extend with `transformLiveToCurrentConditions`
  - `lib/server/app.ts` — Hono app (zero framework imports), exports AppType
  - `lib/server/routes/weather.ts` — chained `.get()` for type inference
  - `lib/server/routes/notifications.ts`
  - `lib/server/notifications.ts` — in-memory ring buffer (max 100)
  - `lib/rpc/client.ts` — `hc<AppType>` singleton
  - Framework adapter — 4-line file
- **Testable:**
  - Live data flows when `WL_*` env vars are set
  - Mock data shows with "MOCK" pill when env vars are unset (`placeholderData`)
  - Auth failure → HTTP 502 (not 401)
  - Rate-limit → HTTP 503
  - Network errors retry; auth/rate-limit do not
  - Parse: strict first → loose fallback + warning → ParseError
  - `useCurrentConditions` hook exists with 60s refetch, 55s stale
- **Outcome:** Live weather station data flowing to dashboard

#### Phase 4.2: Tighten Env Validation
- **Build:** Change `WL_*` env vars from `.optional()` to required in `lib/env.server.ts` for production builds.
- **Testable:** Production build fails without `WL_*` vars set; dev build succeeds with optional vars
- **Outcome:** Environment validation enforced for deployment

**Milestone 4 acceptance:** Live weather flowing, error handling verified, typecheck + lint + build pass.

---

### Milestone 5: Deployment Verification

**Goal:** Production-ready deployment via SST.

#### Phase 5.1: SST Config Finalization
- **Build:** Update `sst.config.ts` for monorepo paths. Reconcile all `NEXT_PUBLIC_*` references to `VITE_*`. Verify OpenNext integration. Set up stage-based env configs (dev, production).
- **Testable:** `sst deploy --stage dev` succeeds; app accessible at `[[DEPLOY-DOMAIN]]`; SST console shows healthy Lambda
- **Outcome:** Verified deployment pipeline

**Milestone 5 acceptance:** App deployed and accessible, all env vars flowing, SST console healthy.

---

### Milestone 6: TanStack Start Migration (Deferred)

**Goal:** Port working scaffold code from `apps/scaffold/` (Next.js) to `apps/web/` (TanStack Start).

- Deferred until explicitly requested
- `apps/web/` already has TanStack Start scaffold (router.tsx, routeTree.gen.ts, vite.config.ts)
- `lib/routing.ts` isolation seam (from Phase 2.1) makes this a controlled swap
- Hono server layer is framework-agnostic — only the adapter file changes

---

## Repository Structure

### Monorepo (primary — all work happens here after Milestone 1)
```
~/Dev/[[GITHUB-ORG]]/[[MONOREPO]]/
  repos/civicpulse/
    apps/
      scaffold/     ← v0 Next.js build (promoted from [[V0-REPO]])
      web/          ← TanStack Start target (Milestone 6)
    libs/
      ui/           ← @rie-civicpulse/ui (shared components, themes)
      mock-data/    ← @rie-civicpulse/mock-data (generators, DATA_REGISTRY)
```

### v0 Standalone (reference — active until Milestone 1 complete)
```
~/Dev/[[GITHUB-ORG]]/[[V0-REPO]]/    (49 commits, pnpm, Next.js 16)
```

### Artefacts (local reference)
```
~/Downloads/civic/
  AGENT_CONTEXT.md       ← full architecture specs (~1200 lines, tokenized)
  EXECUTION_PLAYBOOK.md  ← phased build steps with code snippets (tokenized)
  IDENTITY_MAP.md        ← token → real value key (NEVER share with agents)
```

---

## Skill Loadout & Quality Gates

### Skills Used During Build

| Skill | When | Purpose |
|-------|------|---------|
| PAUL | All milestones | Structured milestone/phase management |
| CARL | All milestones | Domain rules enforcement |
| AEGIS | Post Milestone 4 | Security and quality audit before production |

### Quality Gates (every phase)

| Gate | Validation Command | Threshold |
|------|--------------------|-----------|
| Typecheck | `yarn typecheck` (monorepo) or `pnpm typecheck` (v0) | Zero errors |
| Lint | `yarn lint` | Zero new warnings |
| Build | `yarn build` | Successful production build |
| Determinism | Run build twice, diff output | Byte-identical mock data |
| No bare Math.random() | `grep -rn "Math.random" --include="*.ts" --include="*.tsx"` | Only in seed.ts + blocksReducer (commented) |
| Framework isolation | `grep -rn "from \"next/" --include="*.ts" --include="*.tsx" \| grep -v "lib/routing.ts"` | Zero results |
| Env isolation | `grep -rn "process.env\|import.meta.env" --include="*.tsx"` | Zero results in components |
| Polygon closure | Assert first coord === last coord for all GeoJSON features | All 12 zones pass |
| Identity masking | `grep -rn` for real institution/person names | Zero hits in agent-facing files |

---

## Design Decisions

1. **Consolidation first, not last:** Monorepo promotion is Milestone 1, not Phase 7. Work in a unified workspace from the start.
2. **v0 as scaffold, not target:** v0 Next.js build lives in `apps/scaffold/` (disposable surrogate). Real app target is `apps/web/` (TanStack Start). Scaffold is for visual QA during development.
3. **Server proxy over SPA calls:** WeatherLink v2 CORS constraint confirmed empirically during [[ATTEMPT-2]]. HMAC header triggers preflight rejection. Server proxy is mandatory.
4. **Hono over Server Actions:** Framework-portable — zero framework imports in server layer. Migration requires swapping one 4-line adapter file.
5. **neverthrow over Effect v4:** Effect's http/httpapi still in unstable/. neverthrow ResultAsync covers the use case.
6. **Radix UI over base-nova:** v0 output is Radix-based. Migration not worth the disruption.
7. **pnpm in v0, Yarn 4 in monorepo:** Don't mix. After consolidation, everything is Yarn.
8. **next-themes:** Already working. Verify `attribute="data-theme"` config, don't replace.
9. **VITE_* env prefix:** Framework-agnostic. Not `NEXT_PUBLIC_*`.
10. **oklch bare channels:** Enables runtime alpha manipulation. hex/rgb can't do this.
11. **Seeded PRNG (seed 20250307):** Deterministic mock data. No snapshot drift.
12. **Identity masking for agent isolation:** All shared docs use `[[TOKENS]]`. IDENTITY_MAP.md never enters agent context.

---

## Open Questions

1. **TanStack Start migration timing:** `apps/web/` scaffold exists — when does porting from scaffold begin?
2. **Jotai wiring:** Components have TODO annotations but no atoms — wire during which milestone?
3. **Real auth backend:** Mock auth is placeholder. What's the auth model for production?
4. **Map tile provider:** Using demo tiles initially. When does Maptiler/Stadia get evaluated?
5. **Effect v4 adoption:** What triggers the switch from neverthrow?
6. **Merge blocks UI:** When is the DnD grid stable enough?
7. **rie-nexus-y9:** Private repo on GitHub — earlier iteration? Archive it?
8. **`[[DEPLOY-DOMAIN]]` token:** Needs to be added to IDENTITY_MAP.md (currently `montz.qzz.io` is bare in sst.config.ts)

---

## Next Actions

- [ ] Run Milestone 1 Phase 1.1 — pull v0 into monorepo as `apps/scaffold/`
- [ ] Add `[[DEPLOY-DOMAIN]]` and `[[SST-APP-NAME]]` to IDENTITY_MAP.md
- [ ] Verify scaffold builds and runs within monorepo workspace
- [ ] Apply masking sweep — grep for real identifiers, tokenize
- [ ] Verify SST deployment pipeline with monorepo structure
- [ ] Initialize PAUL or begin work via Antigravity using tokenized artefacts

---

## References

- `[[V0-REPO]]` on `[[GITHUB-ORG]]` — v0 standalone build (49 commits)
- `[[MONOREPO]]` on `[[GITHUB-ORG]]` — monorepo target (21 commits)
- `~/Downloads/civic/AGENT_CONTEXT.md` — canonical architecture spec (tokenized)
- `~/Downloads/civic/EXECUTION_PLAYBOOK.md` — phased build guide (tokenized)
- `~/Downloads/civic/IDENTITY_MAP.md` — restoration key (LOCAL ONLY)

---

*Last updated: 2026-05-10*
