import { useState } from "react"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface CalendarHeatmapProps {
  data?: unknown
}

interface CalendarCell {
  date: string
  count: number
  week: number
  day: number
}

export function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const incidents = data ?? DATA_REGISTRY.incidents
  const incidentArray = Array.isArray(incidents) ? incidents : []

  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)

  const cellsByDate: Record<string, number> = {}
  incidentArray.forEach((incident: { createdAt?: string; date?: string }) => {
    const dateStr = incident.createdAt || incident.date || ""
    const dateKey = dateStr.split("T")[0]
    cellsByDate[dateKey] = (cellsByDate[dateKey] || 0) + 1
  })

  const cells: Array<CalendarCell> = []
  const currentDate = new Date(startOfYear)
  while (
    currentDate <= today &&
    currentDate.getFullYear() === today.getFullYear()
  ) {
    const dateStr = currentDate.toISOString().split("T")[0]
    const weekNumber = Math.floor(
      (currentDate.getTime() - startOfYear.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    )
    const dayOfWeek = currentDate.getDay()
    cells.push({
      date: dateStr,
      count: cellsByDate[dateStr] || 0,
      week: weekNumber,
      day: dayOfWeek === 0 ? 6 : dayOfWeek - 1,
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const maxCount = Math.max(...cells.map((c) => c.count), 1)

  const getColor = (count: number): string => {
    if (count === 0) return CHART_COLORS.muted
    const intensity = count / maxCount
    if (intensity < 0.2) return CHART_COLORS.primary
    if (intensity < 0.4) return CHART_COLORS.accent
    if (intensity < 0.6) return CHART_COLORS.warning
    if (intensity < 0.8) return CHART_COLORS.fire
    return CHART_COLORS.fire
  }

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"]
  const weeks = Math.max(...cells.map((c) => c.week)) + 1

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="flex gap-2">
        <div className="w-6 flex-shrink-0" />
        <div className="flex gap-0.5">
          {Array.from({ length: weeks }, (_, i) => (
            <div key={`week-${i}`} className="flex flex-col gap-0.5">
              {Array.from({ length: 7 }, (__, d) => {
                const cell = cells.find((c) => c.week === i && c.day === d)
                return (
                  <div
                    key={`${i}-${d}`}
                    className="h-2.5 w-2.5 cursor-pointer rounded-sm transition-all hover:ring-1"
                    style={{
                      backgroundColor: cell
                        ? getColor(cell.count)
                        : CHART_COLORS.muted,
                      opacity: cell ? 1 : 0.2,
                    }}
                    onClick={() => cell && setSelectedDate(cell.date)}
                    title={cell ? `${cell.date}: ${cell.count} incidents` : ""}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="text-muted-foreground flex gap-2 text-xs">
        <div className="w-6 flex-shrink-0" />
        <div className="flex gap-0.5">
          {dayLabels.map((label, i) => (
            <div
              key={label}
              className="flex h-2.5 w-2.5 items-center justify-center text-xs"
            >
              {i % 2 === 0 ? label : ""}
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="text-muted-foreground mt-2 text-xs">
          {selectedDate}: {cellsByDate[selectedDate] || 0} incidents
        </div>
      )}

      <div className="text-muted-foreground mt-2 flex gap-1 text-xs">
        <span>Less</span>
        <div
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.muted }}
        />
        <div
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.primary }}
        />
        <div
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.accent }}
        />
        <div
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.warning }}
        />
        <div
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.fire }}
        />
        <span>More</span>
      </div>
    </div>
  )
}
