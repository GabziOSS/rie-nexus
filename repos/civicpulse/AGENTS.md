# CivicPulse — Agent Supplement

This file extends the root `AGENTS.md` with context specific to the
`repos/civicpulse` project. Read both files before working on this project.

---

## What This App Is

CivicPulse is a city safety and risk management dashboard for
**Calbayog City, Samar, Philippines** (12.0685° N, 124.5908° E).

It visualizes incident data (fire, flood, crime, medical, infrastructure,
weather) across 12 barangay zones, with a live map, dashboard charts,
and a data table.

---

## Workspace Packages

| Package   | Path                                   | Name                        | Role                       |
| --------- | -------------------------------------- | --------------------------- | -------------------------- |
| Web app   | `repos/civicpulse/apps/civicpulse-web` | `civicpulse-web`            | TanStack Start SPA         |
| UI lib    | `repos/civicpulse/libs/ui`             | `@rie-civicpulse/ui`        | shadcn components + themes |
| Mock data | `repos/civicpulse/libs/mock-data`      | `@rie-civicpulse/mock-data` | Generated safety data      |

### Install into a package

```bash
# App
yarn workspace civicpulse-web add [package]

# UI lib
yarn workspace @rie-civicpulse/ui add [package]

# Mock data
yarn workspace @rie-civicpulse/mock-data add [package]
```

### Run app dev server

```bash
yarn --filter civicpulse-web dev
```

---

## Route Structure

```
src/routes/
├── __root.tsx          ← root layout (AppShell)
├── index.tsx           ← redirects to /dashboard
├── dashboard/
│   ├── route.tsx       ← shared tab layout (Overview | Data Table)
│   ├── index.tsx       ← chart grid view
│   └── table.tsx       ← data table view
└── map/
    └── index.tsx       ← MapLibre full-screen view
```

All routes use TanStack Start file-based routing.
Export `Route` via `createFileRoute` or `createRootRoute`.
Never use Next.js `page.tsx` or `layout.tsx` conventions.

---

## Import Paths

```tsx
// UI components
import { Button } from "@rie-civicpulse/ui/components/button"
import { cn } from "@rie-civicpulse/ui/lib/utils"

// Mock data
import { INCIDENTS, ZONES, METRICS } from "@rie-civicpulse/mock-data"
import type { Incident, Zone } from "@rie-civicpulse/mock-data/types"

// App-local
import { MyComponent } from "@/components/my-component"
```

---

## Theme System

Six themes controlled by `data-theme` attribute on `<html>`.

| ID                    | Font          | Primary                 | Accent                |
| --------------------- | ------------- | ----------------------- | --------------------- |
| `civicpulse`          | Sora          | Blue `219 95% 61%`      | Amber `32 94% 49%`    |
| `calbayog-gov-plus`   | Outfit        | Navy `213 84% 47%`      | Gold `45 100% 50%`    |
| `nwssu-academic`      | Crimson Pro   | Crimson `350 67% 36%`   | Gold `42 66% 47%`     |
| `civic-fusion`        | Inter         | Navy-Blue `213 72% 42%` | Gold `43 82% 48%`     |
| `obsidian-ops`        | Space Grotesk | Ice Blue `199 98% 58%`  | Violet `270 75% 65%`  |
| `terracotta-republic` | DM Sans       | Orange `17 90% 55%`     | Sun Gold `47 95% 60%` |

Theme CSS files: `repos/civicpulse/libs/ui/src/styles/themes/`
Default theme: `civicpulse`

Theme is stored in `localStorage` key `civicpulse_theme`.
Apply via `document.documentElement.setAttribute("data-theme", theme)`.

---

## Component Locations

| Component     | File                                        | Import                                         |
| ------------- | ------------------------------------------- | ---------------------------------------------- |
| AppShell      | `libs/ui/src/components/app-shell.tsx`      | `@rie-civicpulse/ui/components/app-shell`      |
| Sidebar       | `libs/ui/src/components/sidebar.tsx`        | `@rie-civicpulse/ui/components/sidebar`        |
| TopBar        | `libs/ui/src/components/top-bar.tsx`        | `@rie-civicpulse/ui/components/top-bar`        |
| ThemeSwitcher | `libs/ui/src/components/theme-switcher.tsx` | `@rie-civicpulse/ui/components/theme-switcher` |
| ChartBlock    | `libs/ui/src/components/chart-block.tsx`    | `@rie-civicpulse/ui/components/chart-block`    |
| StatCardFull  | `libs/ui/src/components/stat-card-full.tsx` | `@rie-civicpulse/ui/components/stat-card-full` |
| RiskBadge     | `libs/ui/src/components/risk-badge.tsx`     | `@rie-civicpulse/ui/components/risk-badge`     |
| ZoneSheet     | `libs/ui/src/components/zone-sheet.tsx`     | `@rie-civicpulse/ui/components/zone-sheet`     |
| LayerDrawer   | `libs/ui/src/components/layer-drawer.tsx`   | `@rie-civicpulse/ui/components/layer-drawer`   |

---

## State Philosophy

- Component-local state: `useState` / `useReducer`
- Cross-tree state: `createContext` + `useContext`
- Atom files exist in `apps/civicpulse-web/src/atoms/` for future wiring
- Wiring points annotated with `// TODO: wire [atomName]`
- Do NOT import or consume atoms in components yet

---

## Data Shape Summary

```typescript
// Incident types
type IncidentType =
  | "fire"
  | "flood"
  | "crime"
  | "medical"
  | "infrastructure"
  | "weather"
type SeverityLevel = "critical" | "high" | "medium" | "low"
type IncidentStatus = "open" | "in_progress" | "resolved"

// Zone IDs: z01–z12 (Calbayog barangay clusters)
// All coordinates: [longitude, latitude] (GeoJSON order)
// All dates: ISO 8601 strings
```

Full types in `repos/civicpulse/libs/mock-data/src/types.ts`.

---

## Chart Color Conventions

Never hardcode colors. Always reference CSS variables:

```typescript
const CHART_COLORS = {
  fire: "hsl(var(--destructive))",
  flood: "hsl(var(--primary))",
  crime: "hsl(var(--accent))",
  medical: "hsl(142 71% 45%)",
  infrastructure: "hsl(270 75% 65%)",
  weather: "hsl(199 98% 58%)",
}
```

---

## Map Config

```typescript
const MAP_CONFIG = {
  center: [124.5908, 12.0685] as [number, number],
  zoom: 12,
  minZoom: 9,
  maxZoom: 18,
  maxBounds: [
    [124.2, 11.75],
    [124.95, 12.4],
  ],
}
```

Style URL from env: `import.meta.env.VITE_MAP_STYLE_URL`

---

## v0 Tool Usage (opencode)

Call v0 for markup-only work. Always prepend to v0 prompts:

```
This component lives in the @rie-civicpulse/ui package.
Read the repo for conventions. No semicolons. Tailwind CSS v4.
Import from @rie-civicpulse/ui/components/*. No Next.js patterns.
Target file: repos/civicpulse/libs/ui/src/components/[name].tsx
```

Do NOT call v0 for: recharts, maplibre, tanstack-table, dnd-kit, routing.

---

## Chunks Remaining

| Chunk                  | Status                        | Notes                                              |
| ---------------------- | ----------------------------- | -------------------------------------------------- |
| 2 — App Shell + Themes | v0                            | Sidebar, TopBar, AppShell, ThemeSwitcher, 6 themes |
| 3 — Mock Data          | opencode                      | `libs/mock-data` package                           |
| 4 — Dashboard Charts   | opencode                      | Recharts + custom SVG charts, DnD grid             |
| 5 — Data Table         | opencode                      | TanStack Table                                     |
| 6 — Map View           | v0 (UI) + opencode (MapLibre) | Zone sheet, layer drawer, then map logic           |
