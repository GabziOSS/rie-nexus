# Chunk 5 — Data Table View

## opencode Prompt

---

Read `AGENTS.md` and `repos/civicpulse/AGENTS.md` before starting.

**Prerequisites:**

- Chunk 2 complete: `@rie-civicpulse/ui` components + `RiskBadge` exist
- Chunk 3 complete: `@rie-civicpulse/mock-data` exports `INCIDENTS`
- Chunk 4 complete: `dashboard/route.tsx` tab layout exists

---

## Goal

Build the Data Table view at `/dashboard/table` using TanStack Table.
Shares the tab strip layout with the chart grid from Chunk 4.

---

## Install

```bash
yarn workspace civicpulse-web add @tanstack/react-table
yarn workspace civicpulse-web add date-fns
```

---

## File Structure

```
repos/civicpulse/apps/civicpulse-web/src/
├── routes/
│   └── dashboard/
│       └── table.tsx              ← update with full implementation
└── components/
    └── data-table/
        ├── incident-table.tsx     ← main table component
        ├── incident-columns.tsx   ← column definitions + badge components
        ├── table-toolbar.tsx      ← search, filters, export
        ├── table-filters.tsx      ← collapsible filter panel
        ├── row-detail-panel.tsx   ← expanded row detail
        ├── status-timeline.tsx    ← incident lifecycle steps
        ├── table-pagination.tsx   ← page controls
        └── index.ts
```

---

## Part 1 — Shared Tab Layout Update

`dashboard/route.tsx` already has a tab strip from Chunk 4.
Verify it has a `Data Table` tab linking to `/dashboard/table`.
If not, add it.

```tsx
// Tab strip in dashboard/route.tsx
<Link to="/dashboard" activeProps={{ className: "border-b-2 border-primary text-foreground" }}>
  Overview
</Link>
<Link to="/dashboard/table" activeProps={{ className: "border-b-2 border-primary text-foreground" }}>
  Data Table
</Link>
```

---

## Part 2 — Column Definitions

```typescript
// incident-columns.tsx
import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import type {
  Incident,
  IncidentType,
  SeverityLevel,
  IncidentStatus,
} from "@rie-civicpulse/mock-data/types"

const col = createColumnHelper<Incident>()

export const columns = [
  // Expand toggle (display column)
  // ID (truncated to 8 chars, mono font)
  // Type (IncidentTypeBadge)
  // Severity (SeverityBadge)
  // Zone name
  // Barangay
  // Status (StatusBadge with animated dot for open/in_progress)
  // Date & time (format: "MMM d, yyyy HH:mm")
  // Responders assigned (tabular-nums)
  // Duration (resolutionMinutes formatted as "42m" or "1h 22m", em dash if undefined)
]
```

### Badge components (in same file)

```tsx
// IncidentTypeBadge
// Icons: Flame / Waves / ShieldAlert / HeartPulse / Wrench / CloudLightning
// Colors via RiskBadge pattern from @rie-civicpulse/ui

// SeverityBadge — uses RiskBadge from @rie-civicpulse/ui

// StatusBadge
const STATUS_CONFIG = {
  open: { label: "Open", dot: "bg-destructive animate-pulse" },
  in_progress: { label: "In Progress", dot: "bg-accent animate-pulse" },
  resolved: { label: "Resolved", dot: "bg-green-500" },
}
```

---

## Part 3 — IncidentTable

```typescript
// incident-table.tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table"
import { useState, useMemo } from "react"
import { INCIDENTS } from "@rie-civicpulse/mock-data"
```

Data filtering via local state:

```tsx
const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d" | "1y">(
  "30d"
)
const [activeTypes, setActiveTypes] = useState<string[]>([
  "fire",
  "flood",
  "crime",
  "medical",
  "infrastructure",
  "weather",
])
// TODO: replace with useContext(DashboardFilterContext) when wiring Chunk 4 filters

const data = useMemo(() => {
  const days = { "24h": 1, "7d": 7, "30d": 30, "90d": 90, "1y": 365 }
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days[timeRange])
  return INCIDENTS.filter(
    (i) => new Date(i.timestamp) >= cutoff && activeTypes.includes(i.type)
  )
}, [timeRange, activeTypes])
```

Table features:

- Multi-column sorting (click header, shift-click for secondary)
- Global search (debounced 300ms via `setTimeout`)
- Row expand toggle
- Pagination: default 25 rows per page
- Sticky header
- Zebra rows: odd `bg-card`, even `bg-card/50`
- Hover: `hover:bg-muted/30`

Table layout:

```tsx
<div className="flex flex-col h-full">
  <TableToolbar table={table} />
  <div className="flex-1 overflow-auto">
    <table className="w-full text-sm border-collapse">
      <thead className="sticky top-0 z-10 bg-card border-b border-border">
      <tbody>
        {rows.map(row => (
          <>
            <tr key={row.id}>...</tr>
            {row.getIsExpanded() && (
              <tr key={`${row.id}-detail`}>
                <td colSpan={columns.length}>
                  <RowDetailPanel incident={row.original} />
                </td>
              </tr>
            )}
          </>
        ))}
  <TablePagination table={table} />
</div>
```

---

## Part 4 — TableToolbar

```
[🔍 Search...     ]  [Type ▾]  [Severity ▾]  [Status ▾]  ··  [Columns ▾]  [↓ Export ▾]
```

Global search: debounced 300ms input calling `table.setGlobalFilter`.

Filter popovers (each):

- Checkboxes for each option with color badges
- Active filter count badge on button: `[Type ▾ 3]`
- Clear all button appears when any filter active

Column visibility popover: toggle switches per column.
ID, Barangay, Responders hidden by default on mobile.

Export dropdown:

```tsx
function exportCSV(table) {
  const rows = table.getFilteredRowModel().rows
  const headers = table
    .getVisibleLeafColumns()
    .filter((c) => c.id !== "expand")
    .map((c) => c.id)
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => JSON.stringify(r.getValue(h) ?? "")).join(",")
    ),
  ].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  Object.assign(document.createElement("a"), {
    href: url,
    download: "incidents.csv",
  }).click()
  URL.revokeObjectURL(url)
}

function exportJSON(table) {
  const rows = table.getFilteredRowModel().rows.map((r) => r.original)
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  Object.assign(document.createElement("a"), {
    href: url,
    download: "incidents.json",
  }).click()
  URL.revokeObjectURL(url)
}
```

---

## Part 5 — TableFilters (collapsible)

Toggled by a "Filters" button in toolbar. When open, shows below toolbar:

- Date range: two date inputs (From / To) + quick presets (Today / This week / This month / Last 3 months)
- Zone multi-select: searchable dropdown, all 12 zone names
- Responders range: min / max number inputs

Active filters: pill tags with × to remove individual filters.

---

## Part 6 — RowDetailPanel

Inline panel below expanded row.
Full width. `bg-card/50 border-y border-border p-4`.

Layout:

```
Zone: [name]  ·  Barangay: [name]                    [Open in Map →]
[lat]° N, [lng]° E

TIMELINE
● Reported    [timestamp]
● Dispatched  [timestamp + ~6min]         (+6 min)
● Resolved    [timestamp + resolutionMinutes]   (+42 min)   (or "Open" if not resolved)

Description:
"[description text]"

[Edit]  [Assign Responder]  [Mark Resolved]  [View on Map]
```

"Open in Map" and "View on Map":

```tsx
import { Link } from "@tanstack/react-router"
;<Link to="/map" search={{ zone: incident.zoneId }}>
  Open in Map →
</Link>
```

"Mark Resolved": local optimistic update — mutate the incident in local state.

```tsx
// TODO: wire to incident mutation atom when available
const [localStatus, setLocalStatus] = useState(incident.status)
```

---

## Part 7 — StatusTimeline

```tsx
// status-timeline.tsx
interface StatusTimelineProps {
  incident: Incident
}
```

Three steps: Reported → Dispatched → Resolved.
Dispatched timestamp = reported + ~6 min (mock approximation).
Resolved timestamp = reported + resolutionMinutes (undefined if not resolved).

Visual: vertical line + circle nodes.
Node colors: muted → accent → primary (or destructive if still open).
Last active node pulses if open or in_progress.

---

## Part 8 — TablePagination

```
[500 incidents · showing 1–25]    [|<  <  Page 1 of 20  >  >|]    [25 rows ▾]
```

Buttons: first / prev / next / last page.
Rows per page select: 10 / 25 / 50.

---

## Part 9 — Route File

```tsx
// routes/dashboard/table.tsx
import { createFileRoute } from "@tanstack/react-router"
import { IncidentTable } from "@/components/data-table/incident-table"

export const Route = createFileRoute("/dashboard/table")({
  component: () => (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">Incident Records</h2>
        <p className="text-muted-foreground text-sm">
          All logged incidents — filter, sort, and export
        </p>
      </div>
      <IncidentTable />
    </div>
  ),
})
```

---

## Acceptance Criteria

- `/dashboard/table` renders with shared tab navigation
- 500 incidents loaded, paginated at 25 per page
- Column header click sorts; shift-click adds secondary sort
- Global search filters across id, zoneName, barangay, description
- Type / Severity / Status filters work and combine
- Expand toggle shows RowDetailPanel with correct timestamps
- StatusTimeline shows correct elapsed times
- "Open in Map" navigates to `/map?zone={zoneId}`
- Export CSV downloads valid comma-separated file
- Export JSON downloads valid JSON array
- Column visibility toggle works
- Table scrolls horizontally on narrow viewports
- Pagination controls work including first/last jumps
- `yarn --filter civicpulse-web typecheck` passes
