"use client"

/**
 * DashboardToolbar
 * Controls row above the dashboard grid.
 * Left: page title + last updated timestamp.
 * Center: time range toggle group.
 * Right: incident type filter chips + Add Block button + Reset button.
 */

import { useState } from "react"
import { AddBlockDrawer } from "@rie-civicpulse/ui/components/add-block-drawer"
import type { ChartBlock } from "@rie-civicpulse/ui/lib/dashboard-blocks"

interface DashboardToolbarProps {
  preset: "overview" | "station"
  onReset: () => void
  onAddBlock: (block: Omit<ChartBlock, "id">) => void
}

const TIME_RANGES = ["24h", "7d", "30d", "90d", "1y"]
const INCIDENT_TYPES = [
  "fire",
  "flood",
  "crime",
  "medical",
  "infrastructure",
  "weather",
]

export function DashboardToolbar({
  preset,
  onReset,
  onAddBlock,
}: DashboardToolbarProps) {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeFilters, setActiveFilters] = useState(new Set(INCIDENT_TYPES))
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)

  const toggleFilter = (type: string) => {
    const newFilters = new Set(activeFilters)
    if (newFilters.has(type)) {
      newFilters.delete(type)
    } else {
      newFilters.add(type)
    }
    setActiveFilters(newFilters)
    // TODO: wire incidentTypeFilterAtom from atoms/dashboard.atoms.ts
  }

  return (
    <div className="border-border flex items-center justify-between gap-6 border-b px-6 py-4">
      {/* Left: Title + timestamp */}
      <div className="flex-1">
        <h2 className="text-foreground text-sm font-medium">
          {preset === "overview" ? "Overview" : "Station View"}
        </h2>
        <p className="text-muted-foreground text-xs">Last updated: just now</p>
      </div>

      {/* Center: Time range */}
      <div className="flex gap-2">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={
              timeRange === range
                ? "bg-primary text-primary-foreground rounded px-3 py-1 text-xs font-medium"
                : "text-muted-foreground hover:text-foreground px-3 py-1 text-xs"
            }
          >
            {range}
          </button>
        ))}
        {/* TODO: wire timeRangeAtom from atoms/dashboard.atoms.ts */}
      </div>

      {/* Right: Filters + Actions */}
      <div className="flex items-center gap-3">
        {/* Filter chips */}
        <div className="flex gap-2">
          {INCIDENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={
                activeFilters.has(type)
                  ? "border-primary/50 bg-primary/10 text-foreground rounded border px-2 py-1 text-xs font-medium capitalize"
                  : "border-border text-muted-foreground hover:border-foreground/30 rounded border px-2 py-1 text-xs capitalize"
              }
            >
              {type}
            </button>
          ))}
        </div>

        {/* Add Block button */}
        <button
          onClick={() => setAddDrawerOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-3 py-1 text-xs font-medium"
        >
          + Add Block
        </button>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="border-border text-muted-foreground hover:text-foreground rounded border px-3 py-1 text-xs"
        >
          Reset
        </button>
      </div>

      {/* Add Block Drawer */}
      <AddBlockDrawer
        open={addDrawerOpen}
        onOpenChange={setAddDrawerOpen}
        onAdd={(block: Omit<ChartBlock, "id">) => {
          onAddBlock(block)
          setAddDrawerOpen(false)
        }}
      />
    </div>
  )
}
