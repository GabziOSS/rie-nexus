# [[PRODUCT-NAME]] — Execution Playbook
> Consolidated from: BEACON_OC_1 → OC_5, V0_SESSION_1 → 3, CHUNK_2 → 6, build plans, addenda.
> Read AGENT_CONTEXT.md first. This file is *what to do next*, in order.
> Identifiers masked. See IDENTITY_MAP.md to restore.

---

## HOW TO USE THIS DOCUMENT

This playbook is sequenced. Each phase has a precondition, a goal, atomic steps,
and an acceptance check. Do **not** skip ahead. If a step fails, stop and resolve
before proceeding — most steps are dependencies for later ones.

**Working directory throughout:** the `[[V0-REPO]]` repository, `main` branch.
There are no feature branches; commits land directly on main with descriptive messages.
The monorepo (`[[MONOREPO]]`) is out of scope until Phase 7.

**Tooling:** pnpm (not yarn). Node version per `mise.toml`.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck    # run after every phase
pnpm lint
```

---

## PHASE 0 — PREFLIGHT (do this first, every session)

**Goal:** Verify the working tree is healthy before any new work.

```bash
git status                    # must be clean or have only intended changes
pnpm install                  # ensure deps fresh
pnpm typecheck                # baseline: must pass
pnpm dev                      # smoke test — site loads at /login
```

**Acceptance:** Login page renders, mock credentials work, dashboard route
accessible, all 19 chart blocks render with placeholder data.

If `pnpm typecheck` fails on `main`, stop and fix the regression before
starting new work. Do not stack errors.

---

## PHASE 1 — INFRASTRUCTURE PRECURSORS

**Precondition:** Phase 0 passes.
**Goal:** Create the framework-isolation seam and env validation before
any data/integration work.

### 1.1 Create routing isolation file

**File:** `lib/routing.ts`

```typescript
// The ONLY file in the codebase that imports from next/navigation or next/link.
// Components import from "@/lib/routing" — never from next/* directly.
// At TanStack Start migration, swap this one file's body.
export { useSearchParams, useParams, useRouter, usePathname, redirect } from "next/navigation"
export { default as Link } from "next/link"
```

### 1.2 Audit existing imports

```bash
# Must return zero results outside lib/routing.ts:
grep -r "from \"next/navigation\"" --include="*.ts" --include="*.tsx" \
    | grep -v "lib/routing.ts"
grep -r "from \"next/link\"" --include="*.ts" --include="*.tsx" \
    | grep -v "lib/routing.ts"
```

For each violation found, replace the import source with `"@/lib/routing"`.

### 1.3 Create environment validation

**File:** `lib/env.client.ts`

```typescript
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const clientEnv = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_MAP_STYLE_URL: z.string().url().optional(),
    VITE_WL_STATION_ID: z.string().optional(),
    VITE_APP_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    VITE_MAP_STYLE_URL: process.env.VITE_MAP_STYLE_URL,
    VITE_WL_STATION_ID: process.env.VITE_WL_STATION_ID,
    VITE_APP_URL: process.env.VITE_APP_URL,
  },
  emptyStringAsUndefined: true,
})
```

**File:** `lib/env.server.ts`

```typescript
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const serverEnv = createEnv({
  server: {
    WL_API_KEY: z.string().min(1).optional(),
    WL_API_SECRET: z.string().min(1).optional(),
    WL_STATION_ID: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
```

The `.optional()` chains keep these soft until OC-5; tighten to required
when WeatherLink lands.

### 1.4 Verify .env.example

Confirm `.env.example` contains all `VITE_*` variables and a comment block
for the `WL_*` server secrets. Do not commit real values.

**Phase 1 acceptance:** `pnpm typecheck` passes; grep audit returns no
direct `next/*` imports outside `lib/routing.ts`.

---

## PHASE 2 — MOCK DATA MODULE (was OC-1)

**Precondition:** Phase 1 complete.
**Goal:** Replace `lib/hooks.ts` inline mock with a deterministic 500-incident
module under `lib/mock-data/`. This unblocks every later phase.

### 2.1 Create directory structure

```
lib/mock-data/
├── index.ts
├── types.ts
├── seed.ts
└── generators/
    ├── incidents.ts
    ├── zones.ts
    ├── zones-geojson.ts
    ├── metrics.ts
    ├── trends.ts
    ├── districts.ts
    ├── direction.ts
    ├── heatmap.ts
    ├── calendar.ts
    ├── bullet.ts
    ├── weather.ts
    └── users.ts
```

### 2.2 Implement seed.ts (Mulberry32)

```typescript
// lib/mock-data/seed.ts
function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6D2B79F5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createRng(seed: number): () => number {
  return mulberry32(seed)
}

export const rng = createRng(20250307)

export function randInt(min: number, max: number, r: () => number = rng): number {
  return Math.floor(r() * (max - min + 1)) + min
}
export function randFloat(min: number, max: number, r: () => number = rng): number {
  return r() * (max - min) + min
}
export function randItem<T>(arr: readonly T[], r: () => number = rng): T {
  return arr[Math.floor(r() * arr.length)]!
}
export function randWeighted<T>(items: readonly T[], weights: readonly number[], r: () => number = rng): T {
  const total = weights.reduce((s, w) => s + w, 0)
  let pick = r() * total
  for (let i = 0; i < items.length; i++) {
    pick -= weights[i]!
    if (pick <= 0) return items[i]!
  }
  return items[items.length - 1]!
}
// Box-Muller for normal distribution (used for resolution time variance)
export function randNormal(mean: number, sd: number, r: () => number = rng): number {
  const u1 = Math.max(r(), Number.EPSILON)
  const u2 = r()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + z * sd
}
```

### 2.3 Implement types.ts

Make all interfaces public exports. **`WeatherData` must be exported** —
`lib/weatherlink/transforms.ts` will import it in Phase 6.

```typescript
// lib/mock-data/types.ts
export type IncidentType = "fire" | "flood" | "crime" | "medical" | "infrastructure" | "weather"
export type Severity = "critical" | "high" | "medium" | "low"
export type IncidentStatus = "open" | "in_progress" | "resolved"
export type RiskLevel = "critical" | "high" | "medium" | "low"

export interface Incident {
  id: string
  type: IncidentType
  severity: Severity
  status: IncidentStatus
  zoneId: string
  zoneName: string
  barangay: string
  description: string
  timestamp: string  // ISO 8601
  resolvedAt?: string
  responseTimeMinutes: number
  durationMinutes?: number
  respondersAssigned: number
  coordinates: [number, number]  // [lng, lat]
}

export interface Zone {
  id: string
  name: string
  barangay: string
  district: number
  centroid: [number, number]
  population: number
  area_km2: number
  riskLevel: RiskLevel
}

export interface Metric {
  key: string
  label: string
  value: number
  delta?: number
  unit?: string
  thresholds?: { low: number; mid: number; high: number; max: number }
}

export interface TrendPoint {
  date: string
  fire: number
  flood: number
  crime: number
  medical: number
  infrastructure: number
  weather: number
}

export interface ResponseTimeTrendPoint {
  date: string
  avgMinutes: number
  slaTarget: number
}

export interface DistrictRiskDimension {
  district: string
  fire: number
  flood: number
  crime: number
  medical: number
  infrastructure: number
}

export interface DirectionData {
  bearing: number          // 0–315, in 45° steps
  label: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"
  bins: [number, number, number]  // [low/medium/high count]
}

export interface HeatMatrixRow {
  category: IncidentType
  cells: number[]  // length 30
}

export interface CalendarDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface BulletData {
  actual: number
  target: number
  ranges: { poor: number; acceptable: number; good: number }
  unit: string
}

export interface WeatherData {
  windSpeed: number
  windBearing: number
  twhIndex: number
  barometer: { value: number; trend: "rising" | "falling" | "steady"; series: Array<{ time: string; value: number }> }
  tempGrouped: { outside: number; heatIndex: number; wetBulb: number }
  tempTrend: Array<{ time: string; outside: number; heatIndex: number; wetBulb: number }>
  humidity: number
  totalRain: number
  rainCalendar: CalendarDay[]
  currentRain: { rate: number; today: number; storm: number }
  sunrise: string
  sunset: string
  moonPhase: string
  moonIllumination: number
  forecast: Array<{ day: string; high: number; low: number; condition: string; pop: number }>
}

export interface MockUser {
  id: string
  name: string
  email: string
  role: "admin" | "coordinator" | "responder" | "viewer"
  lastLogin: string
  active: boolean
}
```

### 2.4 Implement zones.ts (use exact centroids from AGENT_CONTEXT.md §6.4)

Generate `ZONES` with `riskLevel` derived from incident counts (do this last,
after `INCIDENTS` is generated, then back-fill).

### 2.5 Implement zones-geojson.ts

Build closed polygons by perturbing the centroid into 6 vertices. **Critical:**
the first and last coordinates must be identical or MapLibre fill-pattern fails.

```typescript
function buildPolygon(centroid: [number, number], areaKm2: number): number[][] {
  const radius = Math.sqrt(areaKm2 / Math.PI) / 111  // km → degrees approximation
  const ring: number[][] = []
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * 2 * Math.PI
    const jitter = 0.7 + randFloat(0, 0.6)
    ring.push([
      centroid[0] + Math.cos(angle) * radius * jitter,
      centroid[1] + Math.sin(angle) * radius * jitter,
    ])
  }
  ring.push(ring[0]!)  // close ring — MUST be identical reference value
  return ring
}
```

### 2.6 Implement incidents.ts (500 items, seasonal weighting)

Distribute 500 incidents across Jan 1 2024 – Mar 7 2025 with seasonal weighting
(see AGENT_CONTEXT.md §6.5 for weights). Use `randWeighted` for type and severity;
use `randNormal` for resolution time variance per severity.

### 2.7 Implement DATA_REGISTRY in index.ts

Every `dataKey` referenced in Phase 3's `DEFAULT_BLOCKS` must resolve here.
Reference AGENT_CONTEXT.md §6.6 for the complete key list.

### 2.8 Acceptance check

```typescript
// Run as a one-off script or in dev tools
import { INCIDENTS, ZONES, ZONES_GEOJSON, DATA_REGISTRY } from "@/lib/mock-data"

console.assert(INCIDENTS.length === 500, "incidents")
console.assert(ZONES.length === 12, "zones")

// All centroids in bounds
for (const z of ZONES) {
  const [lng, lat] = z.centroid
  console.assert(lng >= 124.39 && lng <= 124.79, `lng oob ${z.id}`)
  console.assert(lat >= 11.92 && lat <= 12.22, `lat oob ${z.id}`)
}

// All polygons closed
for (const f of ZONES_GEOJSON.features) {
  const ring = (f.geometry as any).coordinates[0] as number[][]
  console.assert(ring[0]![0] === ring[ring.length - 1]![0], `unclosed ${f.id}`)
  console.assert(ring[0]![1] === ring[ring.length - 1]![1], `unclosed ${f.id}`)
}
```

**Phase 2 acceptance:**
- `pnpm typecheck` passes
- All assertions above succeed
- Existing `lib/hooks.ts` still works (don't delete it yet — Phase 3 deprecates it)
- Re-running the build twice produces byte-identical output (deterministic)

---

## PHASE 3 — CHART WIRING (was OC-2)

**Precondition:** Phase 2 complete.
**Goal:** Switch existing chart components from `lib/hooks.ts` mock to
`DATA_REGISTRY`. Implement blocks reducer + preset persistence.
Create weather integration stubs (do NOT implement live weather).

### 3.1 Create chart color constants

**File:** `lib/chart-colors.ts` — copy spec from AGENT_CONTEXT.md §8 verbatim.

### 3.2 Create blocks reducer

**File:** `lib/dashboard-blocks.ts`

```typescript
import type { ChartBlock } from "./mock-data/types"

// (move ChartBlock & ChartType to lib/mock-data/types.ts if not already there)

export type BlockAction =
  | { type: "ADD";         block: Omit<ChartBlock, "id"> }
  | { type: "REMOVE";      id: string }
  | { type: "RESIZE";      id: string; colSpan: 1|2|3; rowSpan: 1|2 }
  | { type: "MERGE";       ids: [string, string] }
  | { type: "SPLIT";       id: string }
  | { type: "REORDER";     activeId: string; overId: string }
  | { type: "LOAD_PRESET"; presetId: "overview" | "weather_station" }
  | { type: "SET_TAB";     id: string; index: number }
  | { type: "RESET" }

export function blocksReducer(state: ChartBlock[], action: BlockAction): ChartBlock[] {
  switch (action.type) {
    case "ADD": {
      const id = `blk_${Math.random().toString(36).slice(2, 9)}`
      // Note: this Math.random is for runtime UI state — NOT data generation.
      // Acceptable here since it's not part of the deterministic mock layer.
      return [...state, { ...action.block, id }]
    }
    case "REMOVE":
      return state.filter(b => b.id !== action.id)
    case "RESIZE":
      return state.map(b => b.id === action.id
        ? { ...b, colSpan: action.colSpan, rowSpan: action.rowSpan }
        : b)
    case "REORDER": {
      const oldIdx = state.findIndex(b => b.id === action.activeId)
      const newIdx = state.findIndex(b => b.id === action.overId)
      if (oldIdx === -1 || newIdx === -1) return state
      const next = [...state]
      const [moved] = next.splice(oldIdx, 1)
      next.splice(newIdx, 0, moved!)
      return next
    }
    case "SET_TAB":
      return state.map(b => b.id === action.id ? { ...b, activeTabIndex: action.index } : b)
    case "LOAD_PRESET":
      return getDefaultBlocksForPreset(action.presetId)
    case "RESET":
      return getDefaultBlocksForPreset("overview")
    case "MERGE":
    case "SPLIT":
      // Defer full implementation — see deferred items in AGENT_CONTEXT.md §19
      return state
    default:
      return state
  }
}
```

### 3.3 Create default block layouts

**File:** `lib/default-dashboard.ts` — implement both presets per AGENT_CONTEXT.md
§7.5 (overview, 19 blocks) and §7.6 (weather_station, ~14 blocks).

### 3.4 Wire DashboardGrid to reducer + persistence

In `components/dashboard/dashboard-grid.tsx`:

```typescript
const [blocks, dispatch] = useReducer(blocksReducer, [], () => {
  if (typeof window === "undefined") return getDefaultBlocksForPreset("overview")
  try {
    const stored = localStorage.getItem(`beacon_blocks_overview`)
    return stored ? JSON.parse(stored) as ChartBlock[] : getDefaultBlocksForPreset("overview")
  } catch { return getDefaultBlocksForPreset("overview") }
})

// Persist on change, debounced 500ms
useEffect(() => {
  const t = setTimeout(() => {
    try { localStorage.setItem(`beacon_blocks_${activePresetId}`, JSON.stringify(blocks)) }
    catch { /* quota exceeded — silent */ }
  }, 500)
  return () => clearTimeout(t)
}, [blocks, activePresetId])
```

### 3.5 Replace hook-based data fetching with DATA_REGISTRY lookup

Create one shared hook:

```typescript
// lib/hooks/use-chart-data.ts
import { DATA_REGISTRY } from "@/lib/mock-data"
import type { ChartBlock } from "@/lib/mock-data/types"

export function useChartData(block: ChartBlock): unknown {
  return DATA_REGISTRY[block.dataKey] ?? null
}
```

Replace the per-chart hooks in existing components. Remove imports of
`lib/hooks.ts` from chart components. (Don't delete `lib/hooks.ts` yet —
keep it for the auth flow until you're sure nothing depends on it.)

### 3.6 Create weather integration stubs (DO NOT implement live)

**File:** `lib/hooks/use-weather-live.ts` — stub only:

```typescript
// Stub. Full implementation in Phase 6 (OC-5).
// This file exists so weather chart components can write the import line now;
// they keep using DATA_REGISTRY data until Phase 6 swaps the data source.
export {}
```

**File:** `lib/weatherlink/transforms.ts`:

```typescript
import type { WeatherData } from "@/lib/mock-data/types"

export interface CurrentConditions {
  windSpeed: number
  windBearing: number
  twhIndex: number
  humidity: number
  barometer: number
  tempOutside: number
  tempHeatIndex: number
  tempWetBulb: number
  rainRate: number
  rainToday: number
}

export function transformMockToCurrentConditions(mock: WeatherData): CurrentConditions {
  return {
    windSpeed:     mock.windSpeed,
    windBearing:   mock.windBearing,
    twhIndex:      mock.twhIndex,
    humidity:      mock.humidity,
    barometer:     mock.barometer.value,
    tempOutside:   mock.tempGrouped.outside,
    tempHeatIndex: mock.tempGrouped.heatIndex,
    tempWetBulb:   mock.tempGrouped.wetBulb,
    rainRate:      mock.currentRain.rate,
    rainToday:     mock.currentRain.today,
  }
}

// TODO(live-weather): add transformLiveToCurrentConditions(raw: WLSensorResponse)
// in Phase 6 (OC-5) when WeatherLink schema is wired.
```

### 3.7 Mark weather chart components for live swap

In every weather chart component, add a TODO comment at the top of the
`useChartData` line:

```typescript
// TODO(live-weather): in Phase 6 (OC-5), swap to:
//   const { data, isPlaceholderData } = useCurrentConditions(VITE_WL_STATION_ID)
const data = useChartData(block) as WeatherData
```

**Phase 3 acceptance:**
- All charts render with data from `DATA_REGISTRY`
- DnD reorder persists across page reload
- Preset switch persists active preset across reload
- `pnpm typecheck` passes
- No new `Math.random()` outside `lib/mock-data/seed.ts` and the explicitly-
  documented runtime UI ID generation in the reducer
- `useCurrentConditions` does not yet exist (verify by grep)

---

## PHASE 4 — TANSTACK TABLE (was OC-3)

**Precondition:** Phase 2 complete (Phase 3 not strictly required).
**Goal:** Replace the visual table shell with a real TanStack Table.

### 4.1 Install dependencies

```bash
pnpm add @tanstack/react-table date-fns
```

### 4.2 Build the table

Implement per AGENT_CONTEXT.md §16. Key files:

```
components/dashboard/
├── incident-table.tsx           ← main table component
├── table-toolbar.tsx            ← search, filters, column visibility, export
├── row-detail-panel.tsx         ← expanded row content
└── filter-controls/
    ├── multi-select-filter.tsx
    ├── date-range-filter.tsx
    └── number-range-filter.tsx
```

### 4.3 Custom filter functions

```typescript
const filterFns = {
  dateRange: (row, columnId, value: { from?: string; to?: string }) => {
    if (!value.from && !value.to) return true
    const cell = new Date(row.getValue<string>(columnId))
    if (value.from && cell < new Date(value.from)) return false
    if (value.to && cell > new Date(value.to)) return false
    return true
  },
  numberRange: (row, columnId, value: [number, number]) => {
    const cell = row.getValue<number>(columnId)
    return cell >= value[0] && cell <= value[1]
  },
}
```

### 4.4 Export

Wire CSV (visible columns only) and JSON (full row originals) to the toolbar.
Use `Blob` + `URL.createObjectURL` + temporary `<a download>` element.
**Do not** install a CSV library — write rows manually with `JSON.stringify`
on each cell to handle escaping.

**Phase 4 acceptance:**
- Sort, filter, search, export, expansion, column visibility, pagination all work
- Default sort: timestamp desc
- Default hidden columns: id, barangay, respondersAssigned
- Empty/loading states render
- `pnpm typecheck` passes

---

## PHASE 5 — MAPLIBRE (was OC-4)

**Precondition:** Phase 2 complete (Phase 3 recommended for `clientEnv`).
**Goal:** Replace map placeholder with real MapLibre GL JS.

### 5.1 Install

```bash
pnpm add maplibre-gl react-map-gl
```

### 5.2 Implement per AGENT_CONTEXT.md §11

Files to create:

```
components/map/
├── city-map.tsx              ← Map root
├── map-controls.tsx          ← navigation + style switcher + heatmap toggle
├── zone-sheet.tsx            ← right-side sheet for active zone
├── map-popup.tsx             ← cluster + incident popups
└── patterns/
    ├── critical-pattern.ts   ← canvas-generated diagonal hatch
    ├── high-pattern.ts       ← dotted amber grid
    ├── medium-pattern.ts     ← solid tint (no canvas pattern needed)
    └── low-pattern.ts        ← crosshatch green
```

### 5.3 Add MapLibre CSS to root layout

```typescript
// app/layout.tsx
import "maplibre-gl/dist/maplibre-gl.css"
```

### 5.4 Pattern registration timing

Patterns must be registered after `map.on("load")`. Wrong:

```typescript
// Wrong — pattern not yet registered when fill-pattern resolves
map.addLayer({ paint: { "fill-pattern": "critical-pattern" } })
```

Correct:

```typescript
map.on("load", () => {
  map.addImage("critical-pattern", buildCriticalPattern())
  // ...other patterns...
  map.addLayer({ paint: { "fill-pattern": ["case", ["==", ["get", "risk"], "critical"], "critical-pattern", ...] } })
})
```

### 5.5 URL deep-linking

```typescript
// Read ?zone=z01 from useSearchParams (via @/lib/routing)
// Wait for map "load" event before flying — flyTo before load is silently ignored
const searchParams = useSearchParams()
const zoneIdFromUrl = searchParams.get("zone")
const handleMapLoad = () => {
  setMapReady(true)
  if (zoneIdFromUrl) {
    const zone = ZONES.find(z => z.id === zoneIdFromUrl)
    if (zone) {
      mapRef.current?.flyTo({ center: zone.centroid, zoom: 14, duration: 1500 })
      setActiveZone(zone)
    }
  }
}
```

**Phase 5 acceptance:**
- Map loads at `[[CITY-COORDS]]`, zoom 12
- All 12 zones render with risk-level patterns
- Click on a zone opens ZoneSheet
- Cluster → unclustered transition at zoom 14 works
- Heatmap toggle works
- `?zone=z01` deep link works on direct page load
- maxBounds prevents panning out of region
- `pnpm typecheck` passes

---

## PHASE 6 — WEATHERLINK LIVE (was OC-5)

**Precondition:** Phases 2–5 complete and stable.
**Goal:** Replace mock weather data with live WeatherLink v2 station data
via Hono server proxy. **Optional** — only attempt when the rest is stable.

### 6.1 Install

```bash
pnpm add hono @hono/vercel @hono/zod-validator @ts-rest/core neverthrow zod
```

### 6.2 Build the WeatherLink module

Files to create:

```
lib/weatherlink/
├── auth.ts            ← HMAC-SHA256 signing
├── client.ts          ← ts-rest typed client
├── service.ts         ← neverthrow ResultAsync service
├── schema.ts          ← Zod schemas (strict + loose)
└── transforms.ts      ← (already exists from Phase 3 — extend it)
```

### 6.3 HMAC signing

```typescript
// lib/weatherlink/auth.ts
import { createHmac } from "crypto"

export function signRequest(params: Record<string, string>, apiSecret: string): string {
  const sortedKeys = Object.keys(params).sort()
  const signatureBase = sortedKeys.map(k => `${k}${params[k]}`).join("")
  return createHmac("sha256", apiSecret).update(signatureBase).digest("hex")
}
```

### 6.4 Build the Hono app

```
lib/server/
├── app.ts                       ← Hono app — exports AppType — ZERO Next.js imports
├── notifications.ts             ← in-memory ring buffer (max 100)
└── routes/
    ├── weather.ts               ← chained .get() routes for type inference
    └── notifications.ts

app/api/[[...route]]/route.ts   ← 4-line Next.js adapter
```

### 6.5 Create the live hook

Replace the stub `lib/hooks/use-weather-live.ts`:

```typescript
import { useQuery } from "@tanstack/react-query"
import { rpc } from "@/lib/rpc/client"
import { transformMockToCurrentConditions, type CurrentConditions } from "@/lib/weatherlink/transforms"
import { WEATHER } from "@/lib/mock-data"

export function useCurrentConditions(stationId: string) {
  return useQuery({
    queryKey: ["weather", "current", stationId],
    enabled: !!stationId,
    queryFn: async (): Promise<CurrentConditions> => {
      const res = await rpc.api.weather.current.$get({ query: { stationId } })
      if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`)
      return await res.json()
    },
    placeholderData: transformMockToCurrentConditions(WEATHER),
    refetchInterval: 60_000,
    staleTime: 55_000,
    retry: 2,
  })
}
```

### 6.6 Swap weather chart components

For each weather chart component, replace the Phase 3 TODO with:

```typescript
const { data, isPlaceholderData } = useCurrentConditions(clientEnv.VITE_WL_STATION_ID ?? "")

return (
  <div>
    {isPlaceholderData && <span className="text-xs text-muted-foreground">MOCK</span>}
    {/* ...chart using data... */}
  </div>
)
```

### 6.7 Tighten env validation

Now that WeatherLink is required for production:

```typescript
// lib/env.server.ts — change .optional() to required for prod
WL_API_KEY:    z.string().min(1),
WL_API_SECRET: z.string().min(1),
WL_STATION_ID: z.string().min(1),
```

**Phase 6 acceptance:**
- Live data flows when `WL_*` env vars are set
- Mock data shows with "MOCK" pill when env vars are unset (placeholderData)
- Auth failure surfaces as HTTP 502 (not 401 — config problem)
- Rate-limit surfaces as HTTP 503
- Network errors retry; auth/rate-limit errors do not
- Parse failures: strict schema first, loose fallback emits a warning, full failure → ParseError
- `pnpm typecheck` passes
- `pnpm build` produces a working production bundle

---

## PHASE 7 — MONOREPO PROMOTION (post all OC sessions)

**Precondition:** Phases 1–6 stable on `[[V0-REPO]]`.
**Goal:** Promote `[[V0-REPO]]` into `[[MONOREPO]]/repos/civicpulse/`.

This phase has its own playbook (not detailed here). Key concerns:
- Switch `[[V0-REPO]]` from pnpm to Yarn 4 OR keep pnpm in the subrepo
- Adopt the package paths from `codemap.nx.md` quick-lookup table
- Decide on the timing of the TanStack Start migration (separate decision)

Defer this until explicitly requested.

---

## STANDING RULES (apply to every phase)

### Code style
- No semicolons, double quotes, 2-space indent, trailing commas ES5
- Files: kebab-case. Components: PascalCase. Hooks: camelCase with `use` prefix.
- `import { type X }` for type-only imports
- `"use client"` only where genuinely required

### Color & theming
- All colors via CSS variables — never hardcode hex/rgb in components
- Exception: MapLibre paint expressions (GPU layer)
- All theme tokens are bare oklch channels: `L% C H` — never `oklch()` wrapped

### Imports
- Routing: only via `@/lib/routing` — never `next/navigation` or `next/link` directly
- Env: only via `clientEnv` / `serverEnv` — never `process.env.*` or `import.meta.env.*`
- Types: `import { type X } from "..."` — never bare `import { X }` for types

### Determinism
- No bare `Math.random()` outside `lib/mock-data/seed.ts`
  - Single allowed exception: runtime UI ID generation in `blocksReducer.ADD`,
    which must be commented to flag the exception
- All mock data must be byte-identical across runs given the same seed

### Acceptance gates (run after every phase)
```bash
pnpm typecheck     # zero errors
pnpm lint          # zero new warnings
pnpm build         # successful production build
```

### Commits
- One commit per logical step within a phase
- Commit messages: `phase N.M: <imperative subject>` — e.g.
  `phase 2.6: implement seasonal incident generation`
- Never combine phases in a single commit
- Push directly to `main` (no feature branches in this repo)

### When stuck
1. Re-read AGENT_CONTEXT.md for the relevant section
2. Check the live repo's `codemap.md` and `lib/codemap.md` for the current
   structure of the area being modified
3. If a decision is needed that isn't covered in AGENT_CONTEXT.md §3 or §19,
   log it as a `// TODO(decision):` comment with context and continue with
   the most reversible option

---

## QUICK REFERENCE — FILE CREATION ORDER

If executed sequentially, files are created in this order:

```
Phase 1:
  lib/routing.ts
  lib/env.client.ts
  lib/env.server.ts

Phase 2:
  lib/mock-data/seed.ts
  lib/mock-data/types.ts
  lib/mock-data/generators/zones.ts
  lib/mock-data/generators/zones-geojson.ts
  lib/mock-data/generators/incidents.ts
  lib/mock-data/generators/metrics.ts
  lib/mock-data/generators/trends.ts
  lib/mock-data/generators/districts.ts
  lib/mock-data/generators/direction.ts
  lib/mock-data/generators/heatmap.ts
  lib/mock-data/generators/calendar.ts
  lib/mock-data/generators/bullet.ts
  lib/mock-data/generators/weather.ts
  lib/mock-data/generators/users.ts
  lib/mock-data/index.ts                  ← exports + DATA_REGISTRY

Phase 3:
  lib/chart-colors.ts
  lib/dashboard-blocks.ts
  lib/default-dashboard.ts
  lib/hooks/use-chart-data.ts
  lib/hooks/use-weather-live.ts           ← stub
  lib/weatherlink/transforms.ts
  (modify) components/charts/*           ← swap to useChartData

Phase 4:
  components/dashboard/incident-table.tsx
  components/dashboard/table-toolbar.tsx
  components/dashboard/row-detail-panel.tsx
  components/dashboard/filter-controls/*

Phase 5:
  components/map/city-map.tsx
  components/map/map-controls.tsx
  components/map/zone-sheet.tsx
  components/map/map-popup.tsx
  components/map/patterns/*

Phase 6:
  lib/weatherlink/auth.ts
  lib/weatherlink/client.ts
  lib/weatherlink/service.ts
  lib/weatherlink/schema.ts
  lib/server/app.ts
  lib/server/notifications.ts
  lib/server/routes/weather.ts
  lib/server/routes/notifications.ts
  lib/rpc/client.ts
  app/api/[[...route]]/route.ts
  (replace) lib/hooks/use-weather-live.ts ← full implementation
```

---

*End of execution playbook.*
*Companion documents: AGENT_CONTEXT.md (architecture/specs), IDENTITY_MAP.md (private restoration key).*
