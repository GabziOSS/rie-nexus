"use client"

/**
 * TimelineHeatmap
 * CSS grid matrix: 6 incident categories (rows) x 30 days (columns).
 * Cell color intensity reflects incident count for that day+category.
 * Month separator between months. Hover tooltip with count.
 */

import { memo, useMemo, useState } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export type IncidentCategory =
  | "fire"
  | "flood"
  | "crime"
  | "medical"
  | "infrastructure"
  | "weather"

export interface TimelineHeatmapCell {
  date: string
  category: IncidentCategory
  count: number
}

export interface TimelineHeatmapProps {
  data?: Array<TimelineHeatmapCell>
  className?: string
}

const CATEGORIES: Array<IncidentCategory> = [
  "fire",
  "flood",
  "crime",
  "medical",
  "infrastructure",
  "weather",
]

// Get cell color based on count intensity
function getCellColor(count: number, max: number): string {
  if (count === 0) return "hsl(var(--muted) / 0.4)"
  const intensity = count / max
  return `hsl(var(--primary) / ${(0.15 + intensity * 0.85).toFixed(2)})`
}

function TimelineHeatmapComponent({ data, className }: TimelineHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<TimelineHeatmapCell | null>(
    null
  )

  // Process data into a grid structure
  const { grid, dates, maxCount } = useMemo(() => {
    if (!data || data.length === 0) {
      return { grid: new Map(), dates: [], maxCount: 0 }
    }

    // Build lookup map: `${date}-${category}` -> count
    const gridMap = new Map<string, number>()
    let max = 0
    const dateSet = new Set<string>()

    for (const cell of data) {
      const key = `${cell.date}-${cell.category}`
      gridMap.set(key, cell.count)
      dateSet.add(cell.date)
      if (cell.count > max) max = cell.count
    }

    // Sort dates
    const sortedDates = Array.from(dateSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )

    return { grid: gridMap, dates: sortedDates, maxCount: max }
  }, [data])

  // Loading state
  if (!data) {
    return (
      <div
        className={cn(
          "bg-muted/30 h-full w-full animate-pulse rounded-lg",
          className
        )}
      />
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div
        className={cn(
          "text-muted-foreground flex h-full w-full items-center justify-center",
          className
        )}
      >
        No heatmap data available
      </div>
    )
  }

  return (
    <div className={cn("h-full w-full overflow-x-auto", className)}>
      <div className="grid" style={{ gridTemplateColumns: "100px 1fr" }}>
        {/* Category labels */}
        <div className="flex flex-col gap-0.5">
          <div className="h-5" /> {/* Spacer for date row */}
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="text-muted-foreground flex h-6 items-center text-xs capitalize"
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex flex-col gap-0.5 overflow-x-auto">
          {/* Date labels row */}
          <div className="flex gap-0.5">
            {dates.map((date, idx) => {
              const d = new Date(date)
              const isFirstOfMonth = d.getDate() === 1
              return (
                <div
                  key={date}
                  className={cn(
                    "text-muted-foreground h-5 w-6 shrink-0 text-center text-[9px]",
                    isFirstOfMonth && idx > 0 && "border-border border-l pl-1"
                  )}
                >
                  {d.getDate()}
                </div>
              )
            })}
          </div>

          {/* Rows for each category */}
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex gap-0.5">
              {dates.map((date, idx) => {
                const key = `${idx}-${date}-${cat}`
                const count = grid.get(key) ?? 0
                const d = new Date(date)
                const isFirstOfMonth = d.getDate() === 1
                const cellData: TimelineHeatmapCell = {
                  date,
                  category: cat,
                  count,
                }

                return (
                  <div
                    key={key}
                    className={cn(
                      "aspect-square h-6 w-6 shrink-0 cursor-pointer rounded-sm transition-all",
                      isFirstOfMonth && idx > 0 && "border-border border-l",
                      hoveredCell &&
                        hoveredCell.date === date &&
                        hoveredCell.category === cat &&
                        "ring-foreground ring-1"
                    )}
                    style={{ backgroundColor: getCellColor(count, maxCount) }}
                    onMouseEnter={() => setHoveredCell(cellData)}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${cat} · ${date} · ${count} incidents`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div className="text-muted-foreground mt-2 text-center text-xs">
          <span className="capitalize">{hoveredCell.category}</span>
          {" · "}
          <span>{hoveredCell.date}</span>
          {" · "}
          <span className="text-foreground font-medium">
            {hoveredCell.count} incidents
          </span>
        </div>
      )}
    </div>
  )
}

TimelineHeatmapComponent.displayName = "TimelineHeatmap"

export const TimelineHeatmap = memo(TimelineHeatmapComponent)
export default TimelineHeatmap
