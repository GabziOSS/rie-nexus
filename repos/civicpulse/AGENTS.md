# CivicPulse — Agent Supplement

Extends root `AGENTS.md`. Read both files before working on this project.

---

## What This App Is

CivicPulse is a city safety and risk management dashboard for
**Calbayog City, Samar, Philippines** (12.0685° N, 124.5908° E).

It visualizes incident data across 12 barangay zones with a live map,
dashboard charts, and a data table. Incident types: fire, flood, crime,
medical, infrastructure, weather.

---

## Component Layer Model

Build and extend strictly bottom-up. Never skip a layer.

```
Layer 1 — Primitives (libs/ui/src/components/primitives/)
  Raw shadcn components. No business logic.
  Button, Input, Card, Sheet, Popover, Tabs, Select,
  Badge, Separator, Tooltip, DropdownMenu, Slider

Layer 2 — Composed (libs/ui/src/components/)
  Built from primitives. No data logic.
  ChartBlock, StatCardFull, RiskBadge, IncidentTypeBadge,
  StatusBadge, Sidebar, TopBar, AppShell, ThemeSwitcher,
  ZoneSheet, LayerDrawer

Layer 3 — Charts (libs/ui/src/components/charts/)
  Built from ChartBlock. Consume recharts or custom SVG.
  All 15 chart type components.

Layer 4 — Data Table (libs/ui/src/components/data-table/)
  Built from primitives + badges. TanStack Table visuals.

Layer 5 — Pages (apps/civicpulse-scaffold/app/)
  Import from libs/ui only. Assemble into views.
  Never contain component logic — layout and composition only.
```

---

## Surrogate App (civicpulse-scaffold)

`civicpulse-scaffold` is a Next.js App Router app.
Its only job is to render `@rie-civicpulse/ui` components for visual QA.

```
apps/civicpulse-scaffold/
├── package.json          name: "civicpulse-scaffold"
├── next.config.ts        path alias → ../../libs/ui/src
├── tsconfig.json         paths for @rie-civicpulse/ui/*
└── app/
    ├── layout.tsx        QueryClientProvider + ThemeProvider
    ├── globals.css       @import "@rie-civicpulse/ui/styles/globals.css"
    ├── page.tsx          redirect → /dashboard
    ├── dashboard/
    │   ├── page.tsx      Overview + Station View tabs + DnD grid
    │   └── table/
    │       └── page.tsx  Data Table visual
    └── map/
        └── page.tsx      Map stub
```

Path alias config:

```ts
// next.config.ts
import path from "path"
const config = {
  webpack: (config) => {
    config.resolve.alias["@rie-civicpulse/ui"] =
      path.resolve(__dirname, "../../libs/ui/src")
    return config
  },
}
```

```json
// tsconfig.json paths
"@rie-civicpulse/ui": ["../../libs/ui/src"],
"@rie-civicpulse/ui/*": ["../../libs/ui/src/*"]
```

---

## libs/ui Structure

```
repos/civicpulse/libs/ui/
├── package.json           name: "@rie-civicpulse/ui"
├── src/
│   ├── index.ts           re-exports all components
│   ├── styles/
│   │   ├── globals.css    @import tailwindcss + all theme files
│   │   └── themes/        one CSS file per theme
│   ├── lib/
│   │   └── utils.ts       cn() utility
│   └── components/
│       ├── primitives/    Layer 1
│       ├── charts/        Layer 3
│       ├── data-table/    Layer 4
│       └── *.tsx          Layer 2 composed components
```

exports field in package.json:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./styles/*": "./src/styles/*.css",
    "./styles/globals.css": "./src/styles/globals.css"
  }
}
```

---

## Theme System

Controlled by `data-theme` attribute on `<html>`.
Default: `civicpulse`.
Persisted to `localStorage` key `civicpulse_theme`.

### Confirmed themes

| ID                    | Font          | Feel                                            |
| --------------------- | ------------- | ----------------------------------------------- |
| `civicpulse`          | Sora          | Modern data-forward civic tech                  |
| `calbayog-gov-plus`   | Outfit        | Deep navy government authority                  |
| `nwssu-academic`      | Crimson Pro   | Crimson and gold academia                       |
| `civic-fusion`        | Inter         | Government + academia merged                    |
| `obsidian-ops`        | Space Grotesk | Ice-black ops precision                         |
| `terracotta-republic` | DM Sans       | Warm terracotta civic                           |
| `typhoon-watch`       | IBM Plex Mono | Storm-green environmental monitoring            |
| + gap fills           | v0 choice     | Cool dark, high-contrast, violet — v0 generates |

All themes: dark mode only. All tokens in HSL format.

---

## Chart Color Conventions

Never hardcode. Always CSS variables:

```typescript
export const CHART_COLORS = {
  fire:           "hsl(var(--destructive))",
  flood:          "hsl(var(--primary))",
  crime:          "hsl(var(--accent))",
  medical:        "hsl(142 71% 45%)",
  infrastructure: "hsl(270 75% 65%)",
  weather:        "hsl(199 98% 58%)",
}
```

---

## Map Config

```typescript
const MAP_CONFIG = {
  center:    [124.5908, 12.0685] as [number, number],
  zoom:      12,
  minZoom:   9,
  maxZoom:   18,
  maxBounds: [[124.20, 11.75], [124.95, 12.40]],
}
```

---

## State Philosophy

- Local UI state: `useState` / `useReducer`
- Server/async state: TanStack Query (`useQuery` / `useMutation`)
- Cross-tree UI state: `createContext` + `useContext`
- Atom stubs exported from `src/atoms/` — not yet wired into components
- Wiring points annotated: `// TODO: wire [atomName] from atoms/[file]`

---

## Data Flow (surrogate)

```
Hardcoded mock arrays (lib/mock/)
  → queryFn wrappers (lib/query/)
    → useQuery hooks (hooks/)
      → components
```

Components never import raw mock data directly.
Always go through a hook.

---

## v0 Session Branch

All v0 generation work happens on `feat/v0-scaffold`.
Review output before merging to `main`.
