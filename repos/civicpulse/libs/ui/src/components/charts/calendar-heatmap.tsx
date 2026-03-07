"use client"

/**
 * CalendarHeatmap
 * GitHub-style calendar grid for 365 days.
 * Weeks as columns (left-to-right), days as rows (Mon-Sun).
 * Day labels on left (Mon, Wed, Fri).
 * Month labels at top. Intensity scale legend at bottom.
 */

import { memo, useMemo, useState } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export interface CalendarHeatmapDay {
  date: string
  count: number
}

export interface CalendarHeatmapProps {
  data?: CalendarHeatmapDay[]
  className?: string
}

// Intensity levels for legend
const INTENSITY_LEVELS = [
  { label: "None", value: 0 },
  { label: "Low", value: 1 },
  { label: "Medium", value: 2 },
  { label: "High", value: 3 },
  { label: "Very High", value: 4 },
]

// Get cell color based on count intensity
function getCellColor(count: number, max: number): string {
  if (count === 0) return "hsl(var(--muted) / 0.3)"
  const ratio = count / max
  if (ratio <= 0.25) return "hsl(var(--primary) / 0.25)"
  if (ratio <= 0.5) return "hsl(var(--primary) / 0.5)"
  if (ratio <= 0.75) return "hsl(var(--primary) / 0.75)"
  return "hsl(var(--primary))"
}

function CalendarHeatmapComponent({ data, className }: CalendarHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<CalendarHeatmapDay | null>(null)

  // Build week structure (53 weeks × 7 days)
  const { weeks, months, maxCount } = useMemo(() => {
    if (!data || data.length === 0) {
      return { weeks: [], months: [], maxCount: 0 }
    }

    // Build lookup: date -> count
    const dataMap = new Map<string, number>()
    let max = 0
    for (const day of data) {
      dataMap.set(day.date, day.count)
      if (day.count > max) max = day.count
    }

    // Generate 53 weeks of data (371 days, 53 weeks × 7 days)
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364)
    // Adjust to start on Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay())

    const weekData: Array<Array<{ date: string; count: number; isPlaceholder: boolean }>> = []
    const monthLabels: Array<{ month: string; weekIndex: number }> = []
    let currentWeek: Array<{ date: string; count: number; isPlaceholder: boolean }> = []
    let lastMonth = -1

    for (let i = 0; i < 371; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const dateStr = d.toISOString().split("T")[0]
      const count = dataMap.get(dateStr) ?? 0
      const isPlaceholder = d > today

      currentWeek.push({ date: dateStr, count, isPlaceholder })

      // Track month changes
      const month = d.getMonth()
      if (month !== lastMonth && !isPlaceholder) {
        monthLabels.push({
          month: d.toLocaleDateString("en-US", { month: "short" }),
          weekIndex: weekData.length,
        })
        lastMonth = month
      }

      if (currentWeek.length === 7) {
        weekData.push(currentWeek)
        currentWeek = []
      }
    }

    return { weeks: weekData, months: monthLabels, maxCount: max }
  }, [data])

  // Loading state
  if (!data) {
    return (
      <div
        className={cn(
          "h-full w-full animate-pulse rounded-lg bg-muted/30",
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
          "flex h-full w-full items-center justify-center text-muted-foreground",
          className
        )}
      >
        No calendar data available
      </div>
    )
  }

  return (
    <div className={cn("flex h-full w-full flex-col gap-2 overflow-x-auto", className)}>
      {/* Month labels */}
      <div className="flex pl-8">
        {months.map((m, idx) => (
          <div
            key={`${m.month}-${idx}`}
            className="text-[10px] text-muted-foreground"
            style={{
              marginLeft: idx === 0 ? `${m.weekIndex * 12}px` : undefined,
              width: `${(months[idx + 1]?.weekIndex ?? weeks.length) - m.weekIndex}rem`,
            }}
          >
            {m.month}
          </div>
        ))}
      </div>

      {/* Grid with day labels */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground">
          <div className="h-3" /> {/* Sun spacer */}
          <div className="h-3">Mon</div>
          <div className="h-3" /> {/* Tue spacer */}
          <div className="h-3">Wed</div>
          <div className="h-3" /> {/* Thu spacer */}
          <div className="h-3">Fri</div>
          <div className="h-3" /> {/* Sat spacer */}
        </div>

        {/* Calendar grid */}
        <div className="flex gap-0.5">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-0.5">
              {week.map((day, dayIdx) => (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={cn(
                    "h-3 w-3 rounded-sm transition-all",
                    day.isPlaceholder && "invisible",
                    hoveredDay?.date === day.date && "ring-1 ring-foreground"
                  )}
                  style={{
                    backgroundColor: day.isPlaceholder
                      ? "transparent"
                      : getCellColor(day.count, maxCount),
                  }}
                  onMouseEnter={() =>
                    !day.isPlaceholder && setHoveredDay(day)
                  }
                  onMouseLeave={() => setHoveredDay(null)}
                  title={day.isPlaceholder ? undefined : `${day.date}: ${day.count} incidents`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 text-[9px] text-muted-foreground">
        <span>Less</span>
        {INTENSITY_LEVELS.map((level) => (
          <div
            key={level.value}
            className="h-3 w-3 rounded-sm"
            style={{
              backgroundColor: getCellColor(
                level.value,
                INTENSITY_LEVELS.length - 1
              ),
            }}
            title={level.label}
          />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="text-center text-xs text-muted-foreground">
          <span>{hoveredDay.date}</span>
          {" · "}
          <span className="font-medium text-foreground">
            {hoveredDay.count} incidents
          </span>
        </div>
      )}
    </div>
  )
}

CalendarHeatmapComponent.displayName = "CalendarHeatmap"

export const CalendarHeatmap = memo(CalendarHeatmapComponent)
export default CalendarHeatmap
