# [[PRODUCT-NAME]] / [[INTERNAL-CODENAME]] — Complete Agent Context
> All personal identifiers, institution names, and geographic locations are masked.
> See IDENTITY_MAP.md (not distributed) to restore real names after development.
> Synthesised from: all project planning docs + live repo inspection (May 2026).
> Active repo: github.com/[[GITHUB-ORG]]/[[V0-REPO]] — **read this first before touching any code.**

---

## ⚡ TL;DR FOR RETURNING AGENTS

- **Primary active repo:** `[[V0-REPO]]` (49 commits, `main` only — single branch)
- **Monorepo:** `[[MONOREPO]]` (21 commits, mostly scaffold — less work here)
- **All active development happens in `[[V0-REPO]]`, not the monorepo**
- **Framework:** Next.js 16.1.6 App Router + pnpm (deviates from Yarn 4 plan)
- **All routes are visual shells** — data wiring (opencode sessions OC-1 through OC-5) is pending
- **Next immediate task:** OC-1 → create `lib/mock-data/` with 500-incident seeded PRNG module

---

## SECTION 1 — PROJECT IDENTITY

**[[PRODUCT-NAME]]** is a web-based city safety and risk management dashboard built
for [[TARGET-CITY]], [[TARGET-PROVINCE]], [[TARGET-COUNTRY]] in collaboration
with the [[PARTNER-AGENCY]] ([[PARTNER-AGENCY-ABBREV]]) and [[UNIVERSITY]]
([[UNIVERSITY-ABBREV]]) [[DEPT]] ([[DEPT-ABBREV]]).

**Purpose:** Real-time situational awareness across 12 zone clusters, aggregating
incident data (fire, flood, crime, medical, infrastructure, weather), weather
station readings from a Davis Instruments WeatherLink v2 station, and risk
indicators into one actionable interface for emergency coordinators.

**Map centre:** `[[CITY-COORDS]]`

**Design mandate:** The interface is a precision instrument — not a website,
not an admin panel. Users are emergency coordinators under pressure. They
need to read a screen fast and act faster. Every element earns its presence.
The default theme (obsidian-ops) is near-black precision with ice-blue
primary — like a cardiac monitor or radar return. Design choices should
reinforce this: tight radius (0.25rem max for obsidian-ops), depth through
background layering not heavy borders, three distinct depth levels
(`--background` → `--card` → `--card-nested`).

---

## SECTION 2 — LIVE REPOSITORY STATUS (inspected May 2026)

### 2.1 `[[V0-REPO]]` — Primary Active Build

**URL:** `github.com/[[GITHUB-ORG]]/[[V0-REPO]]`
**Commits:** 49 on `main` (single branch — no feature branches)
**Preview:** `[[VERCEL-PREVIEW-URL]]`
**Package manager:** pnpm (deviates from Yarn 4 plan — see §4.3)
**Framework:** Next.js 16.1.6 App Router

**What actually exists and works:**

```
[[V0-REPO]]/
├── .opencode/            ← opencode agent session context
├── .slim/                ← omo-slim cartography (token-efficient agent nav)
├── app/
│   ├── layout.tsx        ✅ ThemeProvider (next-themes), Analytics, global components
│   ├── globals.css       ✅ Tailwind v4 + theme CSS variable definitions
│   ├── (auth)/
│   │   ├── login/        ✅ Full login page with split layout
│   │   └── forgot-password/ ✅ Form shell
│   └── (shell)/          ✅ Authenticated shell (Sidebar + Topbar)
│       ├── dashboard/
│       │   ├── overview/       ✅ 19-block DnD chart grid
│       │   ├── station/        ✅ Weather station preset grid
│       │   ├── table/          ✅ Data table visual shell (TanStack Table NOT wired)
│       │   ├── weather/        ✅ Category view shell
│       │   ├── crime/          ✅ Category view shell
│       │   ├── fire/           ✅ Category view shell
│       │   ├── flood/          ✅ Category view shell
│       │   ├── medical/        ✅ Category view shell
│       │   └── infrastructure/ ✅ Category view shell
│       ├── map/          ✅ Shell (MapLibre NOT wired — custom SVG hex map placeholder)
│       ├── alerts/       ✅ Visual shell with hardcoded alert data
│       ├── users/        ✅ Visual shell with hardcoded user roster
│       └── settings/     ✅ Appearance + Dashboard + Notifications + Data panels
├── components/
│   ├── ui/               ✅ Radix UI primitives (NOT base-nova as originally planned)
│   ├── shell/            ✅ Sidebar (collapsible), Topbar (live clock)
│   ├── dashboard/        ✅ DashboardGrid, ChartBlock, IncidentTable shell, etc.
│   ├── charts/           ✅ Recharts implementations (all 16 chart types)
│   └── map/              ✅ Map component shells
├── lib/
│   ├── types.ts          ✅ Incident, StatCardData, TrendPoint, CategoryBar,
│   │                        DistrictRadar, ResponseTimePoint, ComposedPoint,
│   │                        ScatterZone, HeatmapCell, CalendarCell, WindRoseData,
│   │                        BulletData, WeatherCondition, ForecastData,
│   │                        SunriseSunsetData, MoonPhaseData, TempHumidityData,
│   │                        MultiTempData, RainBarData, BarometerPoint + more
│   ├── theme.ts          ✅ THEME definitions, ENABLED_THEMES, getEffectiveMode,
│   │                        applyTheme, getStoredTheme, initTheme, initThemeListener
│   ├── presets.ts        ✅ PRESETS map, getPreset, getStoredPreset, savePreset
│   ├── hooks.ts          ✅ Mock data hooks: useStatCards, useIncidentTrend,
│   │                        useCategoryBar, useDistrictRadar, useCityRiskScore,
│   │                        useReadinessScore, useResponseTime, useResolutionRate,
│   │                        useComposedData, useScatterData, useTimelineHeatmap,
│   │                        useCalendarHeatmap, useWindRose, useRiskVector,
│   │                        useBulletData, useSparkBar, useIncidents + more
│   ├── auth.tsx          ✅ AuthProvider, useAuth, getLastLogin
│   │                        (localStorage-based, mock credentials)
│   └── utils.ts          ✅ cn() Tailwind class helper
├── hooks/
│   ├── use-toast.ts      ✅
│   └── use-mobile.ts     ✅
├── styles/               ✅ Theme CSS files (8 themes in oklch)
├── docs/                 ← agent documentation
├── bin/                  ← scripts
├── codemap.md            ✅ Root-level agent nav map
├── codemap.nx.md         ✅ NX monorepo import patterns + agent quick-lookup
├── sst.config.ts         ✅ SST v4 deployment (AWS via OpenNext)
├── open-next.config.ts   ✅
├── components.json       ✅ shadcn config (style: "default", Radix-based)
└── .env.example          ✅
```

**What is NOT yet done (opencode sessions still pending):**

| Session | Status | What's missing |
|---------|--------|----------------|
| OC-1 Mock Data | ❌ Pending | `lib/mock-data/` module — 500 incidents, seeded PRNG, `DATA_REGISTRY` |
| OC-2 Chart Wiring | ❌ Pending | Wire charts to real data, blocks reducer, preset persistence, weather stubs |
| OC-3 TanStack Table | ❌ Pending | Full TanStack Table (table route is visual shell only) |
| OC-4 MapLibre | ❌ Pending | Real MapLibre GL JS (map is SVG placeholder) |
| OC-5 WeatherLink Live | ❌ Pending | Hono proxy + neverthrow service + live weather hook |

---

### 2.2 `[[MONOREPO]]` — Monorepo Target (lighter)

**URL:** `github.com/[[GITHUB-ORG]]/[[MONOREPO]]`
**Commits:** 21 on `main` (single branch)
**Package manager:** Yarn 4 (Berry)
**Template base:** TanStack Start + shadcn/ui monorepo template

```
[[MONOREPO]]/
├── .opencode/plans/archived/   ← archived opencode planning sessions
├── .yarn/
├── repos/civicpulse/           ← subrepo (mostly scaffold-level)
├── AGENTS.md
├── opencode.jsonc              ← opencode config (big-pickle model)
├── package.json                ← Yarn 4 workspace root
├── tsconfig.json
├── turbo.json
└── yarn.lock
```

**Assessment:** The monorepo is correctly scaffolded but has much less implemented
code than `[[V0-REPO]]`. Promotion of v0 output into the monorepo (via
`scripts/promote-beacon.sh`) has not materially happened yet. **All active
development should continue targeting `[[V0-REPO]]` directly.** Monorepo
promotion is a post-OC-4 concern.

---

### 2.3 Key Deviations: Plan vs Reality

| What the plan said | What the live build actually has | Impact |
|--------------------|----------------------------------|--------|
| shadcn `base-nova` (Base UI primitives) | **Radix UI** (`components/ui/`) | Moderate — state attrs differ (`data-open:` vs `data-[state=open]:`) |
| Yarn 4 as package manager | **pnpm** in `[[V0-REPO]]` | Low for standalone; matters for monorepo merge |
| Custom `data-theme` attribute switching | **`next-themes`** library | Compatible if `attribute="data-theme"` is configured — verify |
| `lib/mock-data/` with 500 incidents + seeded PRNG | **`lib/hooks.ts`** with inline mock data | Significant — OC-1 must create the proper module |
| TanStack Query for async state | None yet — hooks return static mock data | OC-2 adds this layer |
| `lib/routing.ts` isolation rule | Not implemented | Create before OC-4 (MapLibre needs it) |
| Jotai atoms | None — using React context + localStorage | Atom stubs can be created in OC-2 |

**Agent guidance on deviations:**
- **Do NOT attempt to migrate Radix UI → Base UI.** The build works. Only fix
  state selector issues (`data-[state=open]:` → `data-open:`) if specific
  components are visually broken. Do not mass-migrate.
- **Do NOT switch pnpm → Yarn** inside `[[V0-REPO]]`. pnpm is the established
  package manager for this repo. Yarn is for the monorepo only.
- **Verify** that `next-themes` is configured with `attribute="data-theme"` so
  the theme CSS system works correctly. If not, patch `app/layout.tsx`.

---

## SECTION 3 — ARCHITECTURE (locked — do not revisit without explicit instruction)

### 3.1 Critical Constraint: WeatherLink v2 is Server-to-Server ONLY

WeatherLink v2 requires:
1. API key as a query parameter
2. HMAC-SHA256 signature over all query params, computed in sorted key order
3. `X-Api-Secret` header injected at the server

The `X-Api-Secret` header triggers a CORS preflight that WeatherLink's servers
reject from browser origins. **Any SPA / browser-direct call will fail at the
preflight stage.** This was confirmed empirically via live browser testing
during [[ATTEMPT-2]]. SSR or a dedicated server proxy is mandatory.

**Chosen architecture:**
```
Browser
  → Hono RPC layer (lib/server/app.ts — zero Next.js imports)
      → ts-rest typed client with HMAC signing (lib/weatherlink/client.ts)
          → WeatherLink v2 API
```

The Next.js adapter (`app/api/[[...route]]/route.ts`) is the only
Next.js-specific file in the server stack. Migration to TanStack Start
requires swapping only this file.

### 3.2 Framework Isolation Rule

All routing primitives must be imported from `lib/routing.ts`.
Never import from `next/navigation`, `next/link`, or any framework
package directly in components.

```typescript
// lib/routing.ts — create this file before OC-4 if it doesn't exist
// This is the ONLY file that knows what framework is in use.
export { useSearchParams, useParams, useRouter } from "next/navigation"
export { default as Link } from "next/link"
export { redirect } from "next/navigation"
```

### 3.3 Locked Technology Decisions

| Layer | Decision | Do not change unless |
|-------|----------|---------------------|
| Frontend scaffold | Next.js 16 App Router | TanStack Start migration confirmed viable |
| Frontend target | TanStack Start | Already decided — migration is the plan |
| Styling | Tailwind CSS v4 (`@theme` blocks) | Never |
| Color model | oklch (bare channel values) | Never |
| UI primitives | Radix UI (de facto) | Specific broken components only |
| Theme switching | `next-themes` with `attribute="data-theme"` | Verify config, don't replace |
| Proxy layer | Hono (not oRPC, not Server Actions) | Never — portability is the point |
| WeatherLink client | ts-rest `initClient` + HMAC signing | Never |
| WeatherLink errors | neverthrow `ResultAsync` | Effect v4 http graduates from unstable |
| Monorepo | NX + Yarn 4 | Never |
| Deployment | SST v4 (AWS) via OpenNext | Never |
| Package manager in `[[V0-REPO]]` | pnpm | Never |

### 3.4 Rejected Alternatives (do not re-propose)

| What was considered | Why rejected |
|--------------------|-------------|
| Zustand | Replaced by Jotai in plan |
| Effect v4 full adoption | `http`/`httpapi` still in `unstable/` as of Mar 2026 |
| @effect/atom | Same; TanStack Query's `placeholderData` covers the use case |
| oRPC | Less portable than Hono — ties to Next.js |
| Server Actions for WeatherLink proxy | Deeply Next.js-specific; incompatible with TanStack Start migration |
| next-themes replacement | Works; verify `attribute="data-theme"` config, don't replace |
| base-nova migration | Not worth the disruption; Radix UI works |
| Real MapLibre in scaffold | Deferred to OC-4 — SVG hex map is the placeholder |
| Continuous corner drag resize | Snap-on-release is more reliable in CSS Grid |
| `NEXT_PUBLIC_*` env prefix | Locks to Next.js; use `VITE_*` prefix for framework-agnostic naming |

---

## SECTION 4 — CODE STYLE (universal — every file touched)

- No semicolons
- Double quotes
- 2-space indent
- Trailing commas ES5
- LF line endings
- TypeScript strict mode + `verbatimModuleSyntax`
- `import { type X }` for type-only imports
- Filenames: **kebab-case** (`my-component.tsx`)
- Components: **PascalCase** (`MyComponent`)
- Hooks: **camelCase with `use` prefix** (`useMyHook`)
- All colors via CSS variables — never hardcode hex/rgb in components
- `"use client"` only where required (hooks, event handlers, browser APIs)
- No bare `Math.random()` outside `lib/mock-data/seed.ts` (once OC-1 lands)
- No `@radix-ui/*` direct imports in new components (use `components/ui/` wrappers)
- No `next/navigation` / `next/link` imports outside `lib/routing.ts`
- No `process.env.*` / `import.meta.env.*` in components — use `clientEnv` / `serverEnv`

**Development commands (`[[V0-REPO]]`):**
```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm lint         # ESLint with auto-fix
pnpm format       # Prettier formatting
pnpm typecheck    # TypeScript checking
pnpm sst:dev      # SST dev mode
pnpm sst:deploy   # SST deployment
```

---

## SECTION 5 — THEME SYSTEM

### 5.1 Two-Layer CSS Architecture (do not deviate)

```css
/* Layer 1 — @theme: Tailwind reads this for utility class generation */
@theme {
  --color-primary:    oklch(var(--primary));
  --color-background: oklch(var(--background));
  /* ...all tokens mapped this way... */
}

/* Layer 2 — actual oklch values per theme (bare channel notation) */
[data-theme="obsidian-ops"] {
  --background:  6% 0.008 250;
  --primary:    72% 0.15 212;
  --accent:     65% 0.18 295;
  /* ...etc... */
}
```

Token values are **bare oklch channels**: `L% C H` — no `oklch()` wrapper.
Components apply as `oklch(var(--primary))`.

### 5.2 Eight Themes (all dark-mode only)

| ID | Font | Primary | Accent |
|----|------|---------|--------|
| `obsidian-ops` | Space Grotesk | Ice blue `72% 0.15 212` | Subtle violet `65% 0.18 295` |
| `civicpulse` | Sora | Electric blue (high C ~250) | Amber (~60 H) |
| `calbayog-gov-plus` | Outfit | Navy blue (~240 H) | Civic gold (~80 H) |
| `nwssu-academic` | Crimson Pro | Deep crimson (~20 H) | Academic gold (~75 H) |
| `civic-fusion` | Inter | Navy-blue (~245 H) | Unified gold (~78 H) |
| `terracotta-republic` | DM Sans | Burnt orange (~42 H) | Sun gold (~82 H) |
| `teal-command` | (v0 gap-fill) | Cool teal | — |
| `midnight-mono` | (v0 gap-fill) | Near-black mono | — |

**Theme switching:** `document.documentElement.setAttribute("data-theme", id)`
Persisted: `localStorage` key `civicpulse_theme`

The live build uses `next-themes`. Verify `ThemeProvider` in `app/layout.tsx`
has `attribute="data-theme"` so the CSS variable system works.

### 5.2a Google Fonts (loaded in globals.css via single @import URL)

All seven font families used across themes:
Sora, Outfit, Crimson Pro, Inter, Space Grotesk, DM Sans, Fraunces.

**Mono font:** IBM Plex Mono (obsidian-ops) or JetBrains Mono — used for
all numerical data: timestamps, axis labels, counters, coordinates. Data
should read like sensor output, not a spreadsheet.

### 5.2b Base CSS Layer (`@layer base` in globals.css)

```css
* { border-color: oklch(var(--border)); box-sizing: border-box; }
html { color-scheme: dark; }
body { background-color: oklch(var(--background)); color: oklch(var(--foreground)); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: oklch(var(--muted)); }
::-webkit-scrollbar-thumb { background: oklch(var(--border)); border-radius: 3px; }
:focus-visible { outline: 2px solid oklch(var(--ring)); outline-offset: 2px; }
::selection { background: oklch(var(--primary) / 0.3); }
.tabular { font-variant-numeric: tabular-nums; }
```

### 5.3 Required CSS Tokens (all themes must define these)

```
--background / --foreground
--card / --card-foreground / --card-nested
--border / --border-subtle
--primary / --primary-foreground
--secondary / --secondary-foreground
--muted / --muted-foreground
--accent / --accent-foreground
--destructive / --destructive-foreground
--success / --success-foreground
--warning / --warning-foreground
--ring
--radius
--font-sans / --font-mono / --font-display
--glow       (ice-blue box-shadow for active/critical states)
```

---

## SECTION 6 — MOCK DATA MODULE (OC-1 — highest priority)

The current `lib/hooks.ts` provides minimal inline mock data sufficient
for visual rendering. OC-1 replaces this with a proper deterministic module.

### 6.1 Target File Structure

```
lib/mock-data/
├── index.ts            ← pre-generates all data at module load; exports constants
├── types.ts            ← all shared TypeScript interfaces (public, stable)
├── seed.ts             ← Mulberry32 PRNG, seed 20250307
└── generators/
    ├── incidents.ts    ← 500 incidents, Jan 2024–Mar 2025
    ├── zones.ts        ← 12 zone definitions with risk levels
    ├── zones-geojson.ts ← closed GeoJSON polygon per zone
    ├── metrics.ts      ← 4 KPI metric objects
    ← trends.ts        ← daily counts by type (365d) + response trend (90d)
    ├── districts.ts    ← 6 districts × 5 risk dimensions
    ├── direction.ts    ← 8-directional incident origin data
    ├── heatmap.ts      ← 6 categories × 30 days matrix
    ├── calendar.ts     ← 365 days with seasonal variance
    ├── bullet.ts       ← response vs SLA bullet chart data
    ├── weather.ts      ← WeatherData for station preset
    └── users.ts        ← 12 mock users
```

### 6.2 Required Exports

```typescript
// lib/mock-data/index.ts
export const INCIDENTS: Incident[]           // exactly 500
export const ZONES: Zone[]                   // exactly 12
export const ZONES_GEOJSON: FeatureCollection // closed GeoJSON polygons
export const METRICS: Metric[]              // 4 KPI objects
export const TREND: TrendPoint[]            // 365 days
export const RESPONSE_TREND: ResponseTimeTrendPoint[]
export const DISTRICT_RISK: DistrictRiskDimension[]
export const DIRECTION_DATA: DirectionData[]
export const HEAT_MATRIX: HeatMatrixRow[]
export const CALENDAR_DATA: CalendarDay[]
export const BULLET_DATA: BulletData
export const WEATHER: WeatherData           // WeatherData must remain public — imported by transforms.ts
export const USERS: MockUser[]
export const DATA_REGISTRY: Record<string, unknown>

// Lookup helpers
export function getZoneById(id: string): Zone | undefined
export function getIncidentsByZone(zoneId: string): Incident[]
export function getIncidentsByType(type: IncidentType): Incident[]
export function getRecentIncidents(days?: number): Incident[]
export function getIncidentsByDateRange(start: string, end: string): Incident[]
```

### 6.3 Seeded PRNG (mandatory)

```typescript
// lib/mock-data/seed.ts
// Seed: 20250307 (project start date — keeps data stable across runs)
// ALL randomness flows through this. No bare Math.random() anywhere else.
export const rng = createRng(20250307)
export function randInt(min: number, max: number, r?: () => number): number
export function randFloat(min: number, max: number, r?: () => number): number
export function randItem<T>(arr: readonly T[], r?: () => number): T
export function randWeighted<T>(items: readonly T[], weights: readonly number[], r?: () => number): T
```

### 6.4 Zone Definitions (exact centroids — geographically real)

```typescript
// All coordinates: [longitude, latitude] (GeoJSON order)
// All centroids within bounds [[124.39, 11.92], [124.79, 12.22]]
const ZONE_DEFINITIONS = [
  { id: "z01", name: "[[ZONE-01]]", barangay: "Poblacion 1-2",  district: 1, centroid: [124.5908, 12.0685], population: 8200,  area_km2: 2.1 },
  { id: "z02", name: "[[ZONE-02]]", barangay: "Bagacay",        district: 1, centroid: [124.5980, 12.0740], population: 5400,  area_km2: 3.8 },
  { id: "z03", name: "[[ZONE-03]]", barangay: "Sabong",         district: 2, centroid: [124.5820, 12.0620], population: 6100,  area_km2: 1.9 },
  { id: "z04", name: "[[ZONE-04]]", barangay: "Nijaga",         district: 2, centroid: [124.6050, 12.0550], population: 4300,  area_km2: 5.2 },
  { id: "z05", name: "[[ZONE-05]]", barangay: "Tinaplacan",     district: 3, centroid: [124.5700, 12.0800], population: 3800,  area_km2: 6.7 },
  { id: "z06", name: "[[ZONE-06]]", barangay: "Rawis",          district: 3, centroid: [124.5650, 12.0500], population: 2900,  area_km2: 4.1 },
  { id: "z07", name: "[[ZONE-07]]", barangay: "Mabini",         district: 4, centroid: [124.6150, 12.0780], population: 5700,  area_km2: 3.3 },
  { id: "z08", name: "[[ZONE-08]]", barangay: "Rizal",          district: 4, centroid: [124.6200, 12.0600], population: 4100,  area_km2: 2.8 },
  { id: "z09", name: "[[ZONE-09]]", barangay: "San Joaquin",    district: 5, centroid: [124.5780, 12.0950], population: 3200,  area_km2: 7.4 },
  { id: "z10", name: "[[ZONE-10]]", barangay: "Hamorawon",      district: 5, centroid: [124.5550, 12.0880], population: 2100,  area_km2: 9.1 },
  { id: "z11", name: "[[ZONE-11]]", barangay: "Lonoy",          district: 6, centroid: [124.6080, 12.0420], population: 3600,  area_km2: 5.6 },
  { id: "z12", name: "[[ZONE-12]]", barangay: "Oquendo",        district: 6, centroid: [124.5930, 12.0350], population: 4800,  area_km2: 4.4 },
] as const
```

### 6.5 Incident Generation Rules

- **500 incidents**, Jan 1 2024 – Mar 7 2025
- **Seasonal patterns** (tropical climate, typhoon-prone region):
  - Floods: peak June–October (typhoon season)
  - Fire: peak March–May (dry season) + December (holiday cooking)
  - Crime: elevated December–February
  - Medical: steady year-round, small spike during floods
  - Infrastructure: peaks 1–2 weeks after flood events
  - Weather: June–November
- **Status distribution:** 85% resolved / 10% in_progress / 5% open
- **Resolution times by severity (minutes, approximate normal distribution):**

| Severity | Mean | SD |
|----------|------|----|
| critical | 18 | 6 |
| high | 32 | 10 |
| medium | 55 | 15 |
| low | 90 | 25 |

- **Severity weights by type:**

| Type | critical | high | medium | low |
|------|---------|------|--------|-----|
| fire | 15% | 35% | 35% | 15% |
| flood | 20% | 40% | 30% | 10% |
| crime | 5% | 20% | 45% | 30% |
| medical | 25% | 30% | 30% | 15% |
| infrastructure | 5% | 15% | 50% | 30% |
| weather | 10% | 30% | 40% | 20% |

### 6.6 DATA_REGISTRY — All Required Keys

```typescript
export const DATA_REGISTRY: Record<string, unknown> = {
  // KPI stat cards
  incidents_total:          METRICS.find(m => m.key === "incidents_total"),
  alerts_active:            METRICS.find(m => m.key === "alerts_active"),
  zones_high_risk:          METRICS.find(m => m.key === "zones_high_risk"),
  response_time_avg:        METRICS.find(m => m.key === "response_time_avg"),
  // Chart data
  incidents_trend:          TREND,
  response_time_trend:      RESPONSE_TREND,
  incidents_by_type:        INCIDENTS,
  district_risk:            DISTRICT_RISK,
  incident_direction:       DIRECTION_DATA,
  incident_heatmap:         HEAT_MATRIX,
  incidents_calendar:       CALENDAR_DATA,
  response_vs_sla:          BULLET_DATA,
  risk_score_current:       { value: 62, max: 100 },
  responder_readiness:      { value: 78, max: 100 },
  risk_vector_bearing:      { bearing: 42 },
  alert_severity_dist:      INCIDENTS,
  incidents_vs_resources:   RESPONSE_TREND,
  density_vs_pop:           ZONES,
  severity_snapshot:        INCIDENTS,
  resolution_rate:          INCIDENTS,
  // Weather station preset
  weather_wind_speed:       WEATHER.windSpeed,
  weather_thw_index:        WEATHER.twhIndex,
  weather_wind_dir:         WEATHER.windBearing,
  weather_wind_rose:        DIRECTION_DATA,
  weather_barometer:        WEATHER.barometer,
  weather_temp_grouped:     WEATHER.tempGrouped,
  weather_temp_trend:       WEATHER.tempTrend,
  weather_humidity:         WEATHER.humidity,
  weather_rain_bullet:      WEATHER.totalRain,
  weather_rain_calendar:    WEATHER.rainCalendar,
  weather_current_rain:     WEATHER.currentRain,
  weather_sunrise:          { sunrise: WEATHER.sunrise, sunset: WEATHER.sunset },
  weather_moon:             { phase: WEATHER.moonPhase, illumination: WEATHER.moonIllumination },
  weather_forecast:         WEATHER.forecast,
  // Category view filtered variants (same data, different dataKey)
  incidents_trend_fire:          TREND.map(/* filter to fire */),
  incidents_trend_flood:         TREND.map(/* filter to flood */),
  // ...etc for all 6 types
}
```

---

## SECTION 7 — DASHBOARD GRID SYSTEM

### 7.1 Block Schema

```typescript
interface ChartBlock {
  id: string
  type: ChartType
  title: string
  subtitle?: string
  dataKey: string
  colSpan: 1 | 2 | 3
  rowSpan: 1 | 2
  unit?: string
  thresholds?: { low: number; mid: number; high: number; max: number }
  merged?: string[]          // IDs of blocks merged into this one
  mergedMeta?: Array<{ id: string; title: string; type: ChartType; dataKey: string }>
  activeTabIndex?: number
}

type ChartType =
  | "stat-card" | "line" | "area" | "bar" | "composed"
  | "radar" | "pie" | "radial" | "scatter" | "gauge-arc"
  | "wind-rose" | "compass" | "spark-bar" | "timeline-heatmap"
  | "calendar-heat" | "bullet"
```

### 7.2 Reducer Actions

```typescript
type BlockAction =
  | { type: "ADD";         block: Omit<ChartBlock, "id"> }
  | { type: "REMOVE";      id: string }
  | { type: "RESIZE";      id: string; colSpan: 1|2|3; rowSpan: 1|2 }
  | { type: "MERGE";       ids: [string, string] }
  | { type: "SPLIT";       id: string }
  | { type: "REORDER";     activeId: string; overId: string }
  | { type: "LOAD_PRESET"; presetId: "overview" | "weather_station" }
  | { type: "SET_TAB";     id: string; index: number }
  | { type: "RESET" }
```

### 7.3 DnD Configuration

```typescript
useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
// 8px threshold prevents accidental drags during chart interactions
```

Grid CSS: `grid grid-cols-3 auto-rows-[minmax(220px,auto)] gap-4`

### 7.4 Preset Persistence

```typescript
// localStorage keys
"beacon_preset"               // active preset ID
"beacon_blocks_${presetId}"   // saved layout per preset (debounced 500ms on change)
```

### 7.5 Default Overview Layout (19 blocks)

```
Row 1:  stat-card × 4      Total Incidents · Active Alerts · High-Risk Zones · Avg Response
Row 2:  line × 2col        Incident Trend
        gauge-arc × 1col   City Risk Score (thresholds: low 25, mid 60, high 85, max 100)
Row 3:  wind-rose × 1col   Incident Origin
        bar × 1col         By Category
        radar × 1col       District Risk Index
Row 4:  area × 2col        Response Time Trend
        gauge-arc × 1col   Readiness (thresholds: low 40, mid 70, high 90, max 100)
Row 5:  timeline-heatmap × 2col  Heat Matrix
        radial × 1col      Resolution Rate
Row 6:  composed × 2col    Incidents vs Deployed
        compass × 1col     Risk Vector
Row 7:  calendar-heat × 3col     Annual Volume (full width)
Row 8:  scatter × 1col     Density vs Population
        bullet × 1col      Response vs SLA
        spark-bar × 1col   Severity Snapshot
```

### 7.6 Weather Station Preset (~14 blocks)

```
Row 1:  gauge-arc × 1col   Wind Speed (0–60 km/h, thresholds: 20/35/45)
        wind-rose × 1col   Wind Rose (rowSpan 2)
        gauge-arc × 1col   THW Index (0–50°C, thresholds: 28/35/40)
Row 2:  compass × 1col     Wind Direction
        spark-bar × 1col   Temperature (outside / heat index / wet bulb)
Row 3:  (wind-rose spanning) line × 1col  Barometer Trend
        bullet × 1col      Total Rain vs Annual Average
Row 4:  gauge-arc × 1col   Humidity (0–100%, thresholds: 60/80/90)
        stat-card × 1col   Current Rain
        stat-card × 1col   Sunrise/Sunset
Row 5:  stat-card × 1col   Moon Phase
        stat-card × 2col   Local Forecast
```

**Station preset dataKey mapping** — the v0 session used short keys;
OC-2 normalises them to `weather_*` prefixed keys in DATA_REGISTRY:

| v0 Session dataKey | OC-2 DATA_REGISTRY key | WeatherLink field |
|--------------------|----------------------|-------------------|
| `wind_speed` | `weather_wind_speed` | `wind_speed_last` |
| `thw_index` | `weather_thw_index` | `thw_index` |
| `humidity` | `weather_humidity` | `hum_out` |
| `wind_rose` | `weather_wind_rose` | derived 8-dir bins |
| `wind_bearing` | `weather_wind_dir` | `wind_dir_last` |
| `temperature_group` | `weather_temp_grouped` | temp_out / heat_index / wet_bulb |
| `barometer_trend` | `weather_barometer` | bar_sea_level series |
| `rain_total` | `weather_rain_bullet` | rainfall_daily_mm |
| `rain_current` | `weather_current_rain` | rainfall_rate_hi |
| `sun_times` | `weather_sunrise` | sunrise / sunset |
| `moon_phase` | `weather_moon` | derived from date |
| `indoor_readings` | (dropped — no ISS indoor sensor) | — |
| `local_forecast` | `weather_forecast` | (stubbed array) |

When OC-2 creates `lib/default-dashboard.ts`, use the `weather_*` prefixed
keys. The v0 session keys are dead references.

---

## SECTION 8 — CHART COLOR SYSTEM

All chart colors via CSS variables. Never hardcode hex/rgb.
**Exception:** MapLibre paint expressions (GPU layer; CSS vars unavailable).

```typescript
// lib/chart-colors.ts — create or confirm this file exists
export const CHART_COLORS = {
  fire:           "oklch(var(--destructive))",
  flood:          "oklch(var(--primary))",
  crime:          "oklch(var(--accent))",
  medical:        "oklch(65% 0.18 145)",   // success green
  infrastructure: "oklch(65% 0.18 295)",   // violet
  weather:        "oklch(72% 0.15 212)",   // ice blue
}

export const SEVERITY_COLORS = {
  critical: "oklch(var(--destructive))",
  high:     "oklch(var(--accent))",
  medium:   "oklch(var(--primary))",
  low:      "oklch(var(--success))",
}

// Apply to every recharts chart:
export const AXIS_PROPS = {
  tick: { fill: "oklch(var(--muted-foreground))", fontSize: 11 },
  axisLine: { stroke: "oklch(var(--border))" },
  tickLine: false,
}
export const TOOLTIP_STYLE = {
  backgroundColor: "oklch(var(--card))",
  border: "1px solid oklch(var(--border))",
  borderRadius: "calc(var(--radius) * 2)",
  color: "oklch(var(--foreground))",
  fontSize: 12,
}
export const GRID_PROPS = {
  strokeDasharray: "3 3",
  stroke: "oklch(var(--border))",
  opacity: 0.4,
}
```

---

## SECTION 9 — CHART COMPONENT SPECIFICATIONS

All charts live in `components/charts/`. All receive `{ block: ChartBlock, data: unknown }`.
All use `<ResponsiveContainer width="100%" height="100%">`. All handle loading
(skeleton shimmer) and empty states.

### Custom SVG Charts (not recharts)

**GaugeArcChart** — `viewBox="0 0 200 120"`, center `100,110`, r=80:
- 180° semicircle (left to right, top half)
- Three colored arc segments at threshold breakpoints: success/warning/destructive
- Background track: full 180° arc in muted color
- Needle: thin triangle, rotates `(value/max)*180°`
- Transition: `transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)`
- Animate from 0 on mount via `useEffect` + `setTimeout(100ms)`

```typescript
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 180) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const s = polarToCartesian(cx, cy, r, startDeg)
  const e = polarToCartesian(cx, cy, r, endDeg)
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${endDeg - startDeg > 180 ? 1 : 0} 1 ${e.x} ${e.y}`
}
```

**WindRoseChart** — `viewBox="0 0 280 280"`, center `140,140`, max radius 100:
- 8 directions, each with 3 stacked arc segments (bins) radiating outward
- Petal width: 30° arc centred on cardinal direction
- Concentric reference rings at 25/50/75/100% of max radius
- Tab strip: DAY / WEEK / MONTH (local `useState`)

**CompassChart** — `viewBox="0 0 160 160"`, center `80,80`, ring r=70:
- 8 major ticks + 16 minor ticks
- N needle: filled triangle `oklch(var(--accent))`
- S needle: filled triangle `oklch(var(--muted-foreground))`
- Both rotate via `transform="rotate(${bearing} 80 80)"`
- Transition: `600ms cubic-bezier(0.34, 1.56, 0.64, 1)`

### CSS Grid Charts (not recharts)

**TimelineHeatmap** — 6 category rows × 30 day columns:
```typescript
function getCellColor(count: number, max: number): string {
  if (count === 0) return "oklch(var(--muted) / 0.4)"
  return `oklch(var(--primary) / ${(0.15 + (count / max) * 0.85).toFixed(2)})`
}
```

**CalendarHeatmap** — 7 rows (Mon–Sun) × 53 columns (weeks), cells 10×10px, gap 2px:
```typescript
const SCALE = [
  "oklch(var(--muted) / 0.4)",
  "oklch(var(--primary) / 0.2)",
  "oklch(var(--primary) / 0.45)",
  "oklch(var(--primary) / 0.7)",
  "oklch(var(--accent))",
]
```

**BulletChart** — horizontal bar, three background bands, actual bar, target rule:
```
[█░░░░░░░░░░░] poor / acceptable / good bands
[████████] actual bar
    [|] target marker
```

### Recharts Chart Components

All recharts charts use `<ResponsiveContainer width="100%" height="100%">` and
apply `AXIS_PROPS`, `TOOLTIP_STYLE`, `GRID_PROPS` from `lib/chart-colors.ts`.

**StatCard** — large count-up number on mount (mono font), unit label smaller
alongside. Delta badge with arrow + percentage + period label; direction-aware
color (destructive for bad trend). 7-bar SVG sparkline below. Subtle `--glow`
box-shadow on the card when delta is negative (bad trend). The number is the
hero — size it accordingly.

**LineChart** — multi-series by incident type. Smooth `type="monotone"` curves.
Dot `r={3}`, hover `r={5}`. Legend pills below — click toggles series via
local `useState<string[]>` for hidden series. Tooltip shows all type values.

**AreaChart** — two series: `avgMinutes` (primary gradient fill) + `p90Minutes`
(accent, 40% opacity). Gradient definition:
```tsx
<defs>
  <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.3} />
    <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0.02} />
  </linearGradient>
</defs>
```
Reference line at y=10 (SLA target): dashed accent, label "SLA 10m".

**BarChart** — one bar per incident category, rounded caps
`radius={[4,4,0,0]}` vertical / `radius={[0,4,4,0]}` horizontal.
Horizontal orientation when `colSpan===1`, vertical when `colSpan≥2`.
Value `<LabelList>` at bar ends in mono font.

**ComposedChart** — dual Y-axis: bars (incident volume, left) + line
(deployed responders, right). `<Brush>` component at bottom when `rowSpan===2`.

**RadarChart** — 6 districts × 5 risk dimensions. `<PolarGrid gridType="polygon">`.
One semi-transparent `<Radar>` per district (`fillOpacity={0.15}`).

**PieChart (Donut)** — severity distribution. `innerRadius="55%" outerRadius="80%"`.
Center label: total count (absolute positioned div over SVG). Active segment
expands outer radius by 8px on hover.

**RadialBarChart** — single arc 0–360°. Background track: full circle
`oklch(var(--muted))` opacity 0.3. Foreground: `oklch(var(--success))`.
Center: `fontSize: 28` percentage + `fontSize: 12` "Resolved" below.

**ScatterChart** — one point per zone. Dot size proportional to `area_km2`,
dot color by risk level. Reference lines at mean x and mean y.
Custom dot: `<circle fillOpacity={0.7} stroke="oklch(var(--border))">`.

**SparkBarChart** — 4 bars (critical / high / medium / low) in severity
colors. No axes, no grid, no legend. Fixed height 120px. Value labels
above bars in mono font.

### ZoneSheet Structure (3 tabs — created in v0, wired in OC-4)

```
Right-side sheet, 420px wide. Three tabs:

Tab 1 — Details:
  2×2 mini stat grid (incidents, responders, risk score, last incident)
  + placeholder chart area

Tab 2 — Timeline:
  3–5 incident entries with type badges + timestamps
  StatusTimeline component (Reported → Dispatched → Resolved)
  Active nodes pulse when status is open/in_progress

Tab 3 — Log Incident:
  Type select · Severity radio · Location input · Description textarea
  Responders number · Status select · Submit button
  Uses useOptimistic for form submission
```

### Status Badges

```typescript
const STATUS_CONFIG = {
  open:        { label: "Open",        dotClass: "bg-destructive animate-pulse" },
  in_progress: { label: "In Progress", dotClass: "bg-warning animate-pulse" },
  resolved:    { label: "Resolved",    dotClass: "bg-success" },
}
```

### Loading & Empty States

All charts handle both:
```tsx
// Loading:
if (!data) return <div className="h-full w-full animate-pulse bg-muted/30 rounded-lg" />
// Empty:
if (Array.isArray(data) && data.length === 0) return <CenteredMutedMessage />
```

---

## SECTION 10 — WEATHERLINK LIVE INTEGRATION PLAN (OC-5)

### 10.1 Full Data Flow

```
WeatherLink v2 API
  ↓ HMAC-SHA256 signed request (lib/weatherlink/auth.ts)
  ↓ ts-rest typed client (lib/weatherlink/client.ts)
  ↓ neverthrow ResultAsync service (lib/weatherlink/service.ts)
  ↓ Hono route (.get() chained — required for type inference)
  ↓ Next.js adapter — ONLY Next.js-specific server file
     (app/api/[[...route]]/route.ts — 4 lines)
  ↓ hono/client RPC singleton (lib/rpc/client.ts)
  ↓ useCurrentConditions() (lib/hooks/use-weather-live.ts)
      placeholderData: transformMockToCurrentConditions(WEATHER)
      refetchInterval: 60_000
      staleTime: 55_000
```

### 10.2 Error Union

```typescript
type WeatherLinkError =
  | NetworkError         // → HTTP 502
  | AuthFailedError      // → HTTP 502 (our config problem, not client's)
  | RateLimitedError     // → HTTP 503
  | StationNotFoundError // → HTTP 404
  | ParseError           // → HTTP 502
  | UpstreamError        // → HTTP 502
```

Retry: only on `NetworkError | UpstreamError`. Never retry auth or rate-limit.

### 10.3 Schema Strategy (strict → loose → warn)

```
Try strict Zod (IssDataSchema, data_structure_type=10)
  ✓ → transformIssToCurrentConditions()
  ✗ → try loose Zod schema
        ✓ → manualTransform() + emitParseWarning() via andTee (side effect, non-blocking)
        ✗ → ParseError
```

### 10.4 OC-2 Stubs (created before OC-5)

OC-2 must create these files so weather chart components have a working
`// TODO(live-weather):` pattern:

```typescript
// lib/hooks/use-weather-live.ts — OC-2 creates this as a stub
export {}  // valid module, exports nothing yet

// lib/weatherlink/transforms.ts — OC-2 creates with mock transform
import type { WeatherData } from "@/lib/mock-data/types"

export interface CurrentConditions { /* ... mirrors WeatherData ... */ }

export function transformMockToCurrentConditions(mock: WeatherData): CurrentConditions {
  return { windSpeed: mock.windSpeed, /* ...etc... */ }
}
// TODO(live-weather): add transformLiveToCurrentConditions(raw: WLSensorResponse)
```

### 10.5 Live vs Mock Indicator Pattern

```typescript
// After OC-5 wires useCurrentConditions:
const { data, isPlaceholderData } = useCurrentConditions(clientEnv.VITE_WL_STATION_ID ?? "")
// isPlaceholderData=true while mock data shows; false once live data arrives

{isPlaceholderData && (
  <span className="text-xs text-muted-foreground tabular-nums">MOCK</span>
)}
```

---

## SECTION 11 — MAP CONFIGURATION (OC-4)

```typescript
const MAP_CONFIG = {
  center:    [124.5908, 12.0685] as [number, number],  // [[CITY-COORDS]]
  zoom:      12,
  minZoom:   9,
  maxZoom:   18,
  maxBounds: [[124.20, 11.75], [124.95, 12.40]],
}
```

**Libraries:** `maplibre-gl` + `react-map-gl`
**Import:** `import Map, { Source, Layer, type MapRef } from "react-map-gl/maplibre"`
**CSS import required:** `import "maplibre-gl/dist/maplibre-gl.css"`
**Style URL from env:** `clientEnv.VITE_MAP_STYLE_URL`

### ActiveZone Interface (used by ZoneSheet and map click handler)

```typescript
interface ActiveZone {
  zoneId: string
  name: string
  barangay: string
  district: number
  riskLevel: "critical" | "high" | "medium" | "low"
  coordinates: [number, number]
  incidentCount: number
  lastIncident: string
}
```

### Canvas Pattern Registration Helper

Patterns must be registered **after `map.on("load")`** — fill-pattern
references fail silently if the image isn't registered yet.

```typescript
function addCanvasPattern(
  map: maplibregl.Map,
  id: string,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 32
): void {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  draw(ctx, size)
  map.addImage(id, ctx.getImageData(0, 0, size, size))
}
```

**Zone fill patterns** (canvas-generated, registered via `map.addImage()`):

| Risk | Pattern | Colors (hardcoded — CSS vars not available at GPU layer) |
|------|---------|-------|
| critical | Diagonal hatching 45° | `rgba(239,68,68,0.55)` lines on `rgba(239,68,68,0.12)` fill |
| high | Dotted amber grid | `rgba(232,137,12,0.6)` dots r=1.5, spacing 8px |
| medium | Solid tint | `rgba(61,126,250,0.18)` fill, no pattern |
| low | Crosshatch green | `rgba(34,197,94,0.3)` lines, spacing 8px |

**MapLibre paint colour approximations (theme-matched):**
```
primary ice-blue: #1cd9ff  (≈ oklch 72% 0.15 212)
accent amber:     #f07b0a  (≈ oklch 65% 0.18 75)
destructive red:  #f03b3b  (≈ oklch 58% 0.22 25)
success green:    #2db86d  (≈ oklch 65% 0.18 145)
```

**Layers (in render order):**
1. `zones-fill` — fill-pattern by risk level
2. `zones-outline` — line color by risk level, 1.5px
3. `zones-labels` — symbol layer, minzoom 11
4. `clusters` — circle, step by point_count
5. `cluster-count` — symbol
6. `incident-points` — circle, filter: no point_count, radius interpolated by zoom
7. `heatmap-layer` — heatmap, maxzoom 15 (toggleable)

**URL deep-linking:** `?zone=z01` → fly to zone centroid + open ZoneSheet.
Wait for map load event before flying.

**Click handler pattern:**
```typescript
const handleMapClick = useCallback((e: MapMouseEvent) => {
  const zoneFeatures = map.queryRenderedFeatures(e.point, { layers: ["zones-fill"] })
  if (zoneFeatures.length > 0) {
    // open ZoneSheet, fly to zone
  } else {
    // close ZoneSheet
  }
}, [])
```

---

## SECTION 12 — ENVIRONMENT VARIABLES

```bash
# Server secrets (dotenvx encrypted — never in client bundle)
WL_API_KEY=...
WL_API_SECRET=...
WL_STATION_ID=...
NODE_ENV=development|production|test

# Client (VITE_* prefix — framework-agnostic, safe to expose)
VITE_MAP_STYLE_URL=https://demotiles.maplibre.org/style.json
VITE_WL_STATION_ID=...
VITE_APP_URL=...
```

**Validation:**
- `lib/env.server.ts` — `@t3-oss/env-core` for server vars (never import client-side)
- `lib/env.client.ts` — `@t3-oss/env-core` for `VITE_*` vars

**Never** use `process.env.*` or `import.meta.env.*` directly in component files.

---

## SECTION 13 — STATE WIRING PATTERN

Jotai atoms are part of the plan but not yet wired. Components use
`useState` / `useReducer` locally with `// TODO: wire [atomName]` annotations.

**Do not remove TODO annotations** — they are the wiring roadmap.

```typescript
// Examples of pending wiring points:
// TODO: wire sidebarCollapsedAtom from atoms/ui.atoms.ts
// TODO: wire timeRangeAtom from atoms/dashboard.atoms.ts
// TODO: wire activeZoneAtom from atoms/map.atoms.ts
// TODO: wire activeThemeAtom from atoms/theme.atoms.ts
```

**Atom file locations (when created):**
```
lib/atoms/
├── auth.atoms.ts       ← userAtom, tokenAtom, isAuthenticatedAtom
├── dashboard.atoms.ts  ← chartBlocksAtom, timeRangeAtom, incidentTypeFilterAtom
├── map.atoms.ts        ← activeZoneAtom, showHeatmapAtom, activeMapLayersAtom
├── theme.atoms.ts      ← activeThemeAtom (atomWithStorage)
└── ui.atoms.ts         ← sidebarCollapsedAtom, notificationCountAtom
```

---

## SECTION 14 — OPENCODE SESSION SEQUENCE

**All sessions target `[[V0-REPO]]` directly.** Monorepo promotion is post-OC-4.

| Session | Prompt doc | Depends on | Parallel with | Key output |
|---------|-----------|-----------|---------------|------------|
| **OC-1** | `BEACON_OC_1_MOCK_DATA.md` | Nothing | — | `lib/mock-data/` module, DATA_REGISTRY |
| **OC-2** | `BEACON_OC_2_WIRING.md` | OC-1 | OC-3, OC-4 | Charts → real data; blocks reducer; preset persistence; weather stubs |
| **OC-3** | `BEACON_OC_3_TABLE.md` | OC-1 | OC-2, OC-4 | Full TanStack Table with sort/filter/export |
| **OC-4** | `BEACON_OC_4_MAP.md` | OC-1 | OC-2, OC-3 | MapLibre layers, zone click, ZoneSheet wiring |
| **OC-5** | `BEACON_OC_5_WEATHER_LIVE.md` | OC-1, OC-2 | — | Hono proxy + WeatherLink live hook (optional) |

**OC-2 carve-out:** Does NOT implement `useCurrentConditions`. Creates two stub
files instead (see §10.4). OC-5 fills the stubs.

---

## SECTION 15 — HONO SERVER LAYER (OC-5 target)

### 15.1 File Structure

```
lib/server/
├── app.ts              ← Hono app — exports AppType — ZERO Next.js imports
├── notifications.ts    ← admin ring buffer (max 100, in-memory)
└── routes/
    ├── weather.ts      ← chained .get() — required for hono/client type inference
    └── notifications.ts

app/api/[[...route]]/route.ts  ← 4-line Next.js adapter (only NS-specific file)
```

### 15.2 Hono App Pattern

```typescript
// lib/server/app.ts — portable, zero Next.js imports
const app = new Hono()
  .basePath("/api")
  .use(cors({ origin: [...], allowHeaders: ["Content-Type"], maxAge: 86400 }))
  .route("/weather", weatherRoutes)
  .route("/admin/notifications", notificationRoutes)

export type AppType = typeof app  // enables hono/client type inference
export default app
```

```typescript
// app/api/[[...route]]/route.ts — the entire file
import { handle } from "@hono/vercel"
import app from "@/lib/server/app"
export const { GET, POST, DELETE } = handle(app)
```

### 15.3 RPC Client Singleton

```typescript
// lib/rpc/client.ts
import { hc } from "hono/client"
import type { AppType } from "@/lib/server/app"
export const rpc = hc<AppType>(clientEnv.VITE_APP_URL ?? "")
```

---

## SECTION 16 — TANSTACK TABLE SPEC (OC-3)

Wire into the existing `app/(shell)/dashboard/table/` route.

**Install:** `pnpm add @tanstack/react-table date-fns`

**Table features:**
- Multi-column sort (click header; shift-click for secondary sort)
- Default sort: `timestamp` descending
- Global search, debounced 300ms, searches across id/zoneName/barangay/description
- Column filters: Type (multi-select), Severity (multi-select), Status (multi-select)
- Date range filter with custom `filterFn: "dateRange"`
- Zone filter (hidden `zoneId` column, `arrIncludes`)
- Responders range filter (`numberRange` custom filterFn)
- Row expansion → `RowDetailPanel`
- Column visibility toggle
- Default page size: 25; options: 10 / 25 / 50
- Sticky header, zebra rows, hover highlight

**Default hidden columns:** `id`, `barangay`, `respondersAssigned`

**Export functions:**
```typescript
// CSV: only visible columns
// JSON: full row.original objects
// triggerDownload via Blob + URL.createObjectURL
```

**Column definitions (order):**
expand toggle · ID (mono, truncated 8 chars) · Type badge · Severity badge ·
Zone name · Barangay · Status badge · Timestamp (mono, formatted) ·
Responders · Duration

---

## SECTION 17 — UNIVERSAL ACCEPTANCE CRITERIA

Before any PR or session commit:

- [ ] `pnpm typecheck` passes with zero TypeScript errors
- [ ] No bare `Math.random()` outside `lib/mock-data/seed.ts`
- [ ] No direct `next/navigation` or `next/link` imports outside `lib/routing.ts`
- [ ] No `process.env.*` or `import.meta.env.*` in component files
- [ ] No hardcoded hex/rgb in chart or theme-dependent components
- [ ] All chart colours via `CHART_COLORS` constants or `oklch(var(--token))`
- [ ] `DATA_REGISTRY` covers every `dataKey` in `DEFAULT_BLOCKS` and `PRESETS`
- [ ] All GeoJSON polygon rings close (first coord === last coord)
- [ ] `INCIDENTS.length === 500` and `ZONES.length === 12` (after OC-1)
- [ ] All zone centroids within `[[124.39, 11.92], [124.79, 12.22]]`
- [ ] No `useCurrentConditions` call exists until OC-5 completes
- [ ] Weather chart components have `// TODO(live-weather):` stub comment (OC-2 → OC-5)

---

## SECTION 18 — KEY FILES QUICK REFERENCE

| File | Exists? | Purpose |
|------|---------|---------|
| `lib/routing.ts` | ❌ Create | Framework routing re-export — only import from here |
| `lib/mock-data/index.ts` | ❌ OC-1 | Pre-generated data + DATA_REGISTRY |
| `lib/mock-data/seed.ts` | ❌ OC-1 | Mulberry32 PRNG, seed 20250307 |
| `lib/mock-data/types.ts` | ❌ OC-1 | Shared TypeScript interfaces (WeatherData must be public) |
| `lib/chart-colors.ts` | ❌ OC-2 | Chart colour constants |
| `lib/dashboard-blocks.ts` | ❌ OC-2 | ChartBlock types + blocksReducer |
| `lib/default-dashboard.ts` | ❌ OC-2 | DEFAULT_BLOCKS for both presets |
| `lib/hooks/use-weather-live.ts` | ❌ OC-2 stub | Stub only — full impl in OC-5 |
| `lib/weatherlink/transforms.ts` | ❌ OC-2 stub | transformMockToCurrentConditions only |
| `lib/weatherlink/auth.ts` | ❌ OC-5 | HMAC-SHA256 signing |
| `lib/weatherlink/service.ts` | ❌ OC-5 | neverthrow ResultAsync service |
| `lib/server/app.ts` | ❌ OC-5 | Hono app (zero Next.js imports), exports AppType |
| `lib/rpc/client.ts` | ❌ OC-5 | hc<AppType> singleton |
| `lib/env.server.ts` | ❌ OC-5 | Server env validation |
| `lib/env.client.ts` | ❌ OC-5 | Client env validation |
| `app/api/[[...route]]/route.ts` | ❌ OC-5 | 4-line Next.js adapter |
| `lib/types.ts` | ✅ Exists | Basic types (expand in OC-1, don't replace) |
| `lib/theme.ts` | ✅ Exists | Theme management + persistence |
| `lib/presets.ts` | ✅ Exists | Preset definitions + persistence |
| `lib/hooks.ts` | ✅ Exists | Inline mock data hooks (superseded after OC-1+OC-2) |
| `lib/auth.tsx` | ✅ Exists | localStorage auth (keep as-is) |
| `lib/utils.ts` | ✅ Exists | cn() helper |
| `components/ui/` | ✅ Exists | Radix UI primitives |
| `components/shell/` | ✅ Exists | Sidebar, Topbar |
| `components/dashboard/` | ✅ Exists | Grid, ChartBlock, IncidentTable shell |
| `components/charts/` | ✅ Exists | All 16 recharts + custom SVG chart types |
| `components/map/` | ✅ Exists | Map component shells |
| `codemap.md` | ✅ Exists | Root agent nav map |
| `codemap.nx.md` | ✅ Exists | NX monorepo import patterns |
| `sst.config.ts` | ✅ Exists | SST v4 configured |
| `open-next.config.ts` | ✅ Exists | OpenNext for AWS Lambda |
| `.env.example` | ✅ Exists | Env var template |

---

## SECTION 19 — DEFERRED ITEMS

Do not implement without explicit instruction:

| Item | Condition to unblock |
|------|---------------------|
| Effect v4 full adoption | `http`/`httpapi` graduate from `unstable/` |
| @effect/atom | Same + only if TanStack Query gap is actively blocking |
| Real auth backend | Post-design review |
| MapLibre real tile server (Maptiler/Stadia) | After WeatherLink server layer is stable |
| Merge blocks full UI (shift+drop) | After core DnD grid is solid |
| Map lasso / geopoint selection | Post OC-4 |
| TanStack Start migration | Still evaluating viability |
| base-nova / Base UI migration | Evaluate if specific components are broken |

---

## SECTION 20 — BUILD HISTORY

| Codename | When | What was learned |
|----------|------|-----------------|
| [[ATTEMPT-1]] | Jan 2026, handmade | Stack is viable; manual scaffolding at this scale is unsustainable |
| [[ATTEMPT-2]] | Feb wks 1-2, AI-assisted scaffold | CORS constraint confirmed empirically; SPA approach ruled out |
| [[ATTEMPT-3]] / [[PRODUCT-NAME]] | Feb wks 3-4 onward, active build | SSR-first; Next.js surrogate; kitchen-sink to surface integration issues |

---

*End of agent context document.*
*Identity mapping: IDENTITY_MAP.md (not distributed).*
