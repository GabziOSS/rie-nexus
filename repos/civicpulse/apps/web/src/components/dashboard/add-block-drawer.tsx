"use client"

import { X } from "@phosphor-icons/react"
import { Button } from "@rie-civicpulse/ui/components/button"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import type { ChartType } from "@/lib/dashboard-blocks"

const CHART_TYPES: Array<{ type: ChartType; label: string }> = [
  { type: "stat-card", label: "Stat Card" },
  { type: "line", label: "Line Chart" },
  { type: "area", label: "Area Chart" },
  { type: "bar", label: "Bar Chart" },
  { type: "composed", label: "Composed Chart" },
  { type: "radar", label: "Radar Chart" },
  { type: "pie", label: "Pie Chart" },
  { type: "radial", label: "Radial Bar" },
  { type: "scatter", label: "Scatter Chart" },
  { type: "gauge-arc", label: "Gauge Arc" },
  { type: "wind-rose", label: "Wind Rose" },
  { type: "compass", label: "Compass" },
  { type: "spark-bar", label: "Spark Bar" },
  { type: "timeline-heatmap", label: "Timeline Heatmap" },
  { type: "calendar-heat", label: "Calendar Heatmap" },
  { type: "bullet", label: "Bullet Chart" },
]

export function AddBlockDrawer({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (type: ChartType) => void
}) {
  const handleSelect = (type: ChartType) => {
    onSelect(type)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer content */}
      <div className="bg-background relative w-full shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-lg font-bold">Add Chart Block</h2>
            <p className="text-muted-foreground text-xs">
              Select a chart type to add to your dashboard
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className={cn(
              "rounded-lg p-2 transition-colors",
              "hover:bg-muted focus-visible:outline-none",
              "focus-visible:ring-ring focus-visible:ring-2"
            )}
          >
            <X weight="bold" className="h-5 w-5" />
          </button>
        </div>

        {/* Grid of chart types */}
        <div className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-3">
          {CHART_TYPES.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className={cn(
                "border-border rounded-lg border p-3 text-left",
                "hover:bg-muted transition-colors",
                "focus-visible:ring-2 focus-visible:outline-none",
                "focus-visible:ring-ring"
              )}
            >
              <div className="text-sm font-medium">{label}</div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
