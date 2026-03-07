import { useState } from "react"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface TimelineHeatmapProps {
  data?: unknown
}

interface HeatmapCell {
  date: string
  count: number
  day: number
  month: number
}

export function TimelineHeatmap({ data }: TimelineHeatmapProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const incidents = data ?? DATA_REGISTRY.incidents
  const incidentArray = Array.isArray(incidents) ? incidents : []

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 365)

  const cellsByDate: Record<string, number> = {}
  incidentArray.forEach((incident: { createdAt?: string; date?: string }) => {
    const dateStr = incident.createdAt || incident.date || ""
    const dateKey = dateStr.split("T")[0]
    cellsByDate[dateKey] = (cellsByDate[dateKey] || 0) + 1
  })

  const cells: Array<HeatmapCell> = []
  const currentDate = new Date(startDate)
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split("T")[0]
    cells.push({
      date: dateStr,
      count: cellsByDate[dateStr] || 0,
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const maxCount = Math.max(...cells.map((c) => c.count), 1)

  const getColor = (count: number): string => {
    if (count === 0) return CHART_COLORS.muted
    const intensity = count / maxCount
    if (intensity < 0.25) return CHART_COLORS.primary
    if (intensity < 0.5) return CHART_COLORS.accent
    if (intensity < 0.75) return CHART_COLORS.warning
    return CHART_COLORS.fire
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="flex gap-2">
        <div className="w-24 flex-shrink-0" />
        <div className="flex gap-0.5 overflow-x-auto pb-2">
          {cells.map((cell, index) => {
            const isMonthStart = cell.day === 1
            return (
              <div
                key={cell.date}
                className="relative flex-shrink-0"
                onMouseEnter={() => setHoveredDate(cell.date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {isMonthStart && index > 0 && (
                  <div
                    className="absolute top-0 bottom-0 -left-0.5 w-px"
                    style={{
                      backgroundColor: CHART_COLORS.border,
                    }}
                  />
                )}
                <div
                  className="aspect-square w-3 cursor-pointer rounded-sm transition-all hover:ring-2"
                  style={{
                    backgroundColor: getColor(cell.count),
                  }}
                  title={`${cell.date}: ${cell.count} incidents`}
                />
              </div>
            )
          })}
        </div>
      </div>

      {hoveredDate && (
        <div className="text-muted-foreground mt-2 text-xs">
          {hoveredDate}: {cellsByDate[hoveredDate] || 0} incidents
        </div>
      )}

      <div className="text-muted-foreground mt-2 flex gap-1 text-xs">
        <span>Less</span>
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.muted }}
        />
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.primary }}
        />
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.accent }}
        />
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.warning }}
        />
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.fire }}
        />
        <span>More</span>
      </div>
    </div>
  )
}
