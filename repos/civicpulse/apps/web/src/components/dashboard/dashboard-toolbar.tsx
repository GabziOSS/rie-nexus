"use client"

import { useState } from "react"
import { Button } from "@rie-civicpulse/ui/components/button"
import { ArrowClockwise, Plus } from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export function DashboardToolbar({
  onAddBlock,
  onResetLayout,
  onTimeRangeChange,
  onFilterChange,
}: {
  onAddBlock: () => void
  onResetLayout: () => void
  onTimeRangeChange: (range: string) => void
  onFilterChange: (types: Array<string>) => void
}) {
  const [timeRange, setTimeRange] = useState("7d")
  const [activeTypes, setActiveTypes] = useState<Array<string>>([
    "fire",
    "flood",
    "crime",
    "medical",
  ])

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
    onTimeRangeChange(value)
    // TODO: wire timeRangeAtom from atoms/dashboard.atoms.ts
  }

  const handleFilterToggle = (type: string) => {
    const updated = activeTypes.includes(type)
      ? activeTypes.filter((t) => t !== type)
      : [...activeTypes, type]
    setActiveTypes(updated)
    onFilterChange(updated)
    // TODO: wire incidentTypeFilterAtom from atoms/dashboard.atoms.ts
  }

  const timeRanges = ["24h", "7d", "30d", "90d", "1y"]

  return (
    <div className="flex items-center justify-between gap-4 border-b p-4">
      {/* Left */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-xs">
          Last updated {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Center */}
      <div className="border-border bg-muted flex gap-1 rounded-lg border p-1">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => handleTimeRangeChange(range)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              timeRange === range
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Filter chips */}
        <div className="flex gap-1">
          {["fire", "flood", "crime", "medical"].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterToggle(type)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                activeTypes.includes(type)
                  ? "bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted border"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Add Block button */}
        <Button size="sm" onClick={onAddBlock}>
          <Plus weight="bold" className="mr-1 h-4 w-4" />
          Add Block
        </Button>

        {/* Reset Layout button */}
        <Button size="sm" variant="outline" onClick={onResetLayout}>
          <ArrowClockwise weight="bold" className="mr-1 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}
