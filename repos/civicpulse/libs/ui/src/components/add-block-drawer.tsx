"use client"

/**
 * AddBlockDrawer
 * Sheet side="right" for adding a new chart block to the grid.
 * Shows all available chart types as cards with preview description.
 * On select: calls onAdd with the new block config.
 */

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@rie-civicpulse/ui/components/primitives/sheet"
import type {
  ChartBlock,
  ChartType,
} from "@rie-civicpulse/ui/lib/dashboard-blocks"

interface AddBlockDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (block: Omit<ChartBlock, "id">) => void
}

const CHART_TYPES: Array<{
  type: ChartType
  name: string
  description: string
}> = [
  {
    type: "stat-card",
    name: "Stat Card",
    description: "Single metric with value",
  },
  {
    type: "line",
    name: "Line Chart",
    description: "Trend over time · multi-series",
  },
  {
    type: "area",
    name: "Area Chart",
    description: "Rolling average with gradient fill",
  },
  {
    type: "bar",
    name: "Bar Chart",
    description: "Category comparison · horizontal/vertical",
  },
  {
    type: "composed",
    name: "Composed Chart",
    description: "Dual axis · bars + line",
  },
  {
    type: "radar",
    name: "Radar Chart",
    description: "Multi-dimension comparison",
  },
  { type: "pie", name: "Pie Chart", description: "Proportion and composition" },
  {
    type: "radial",
    name: "Radial Bar",
    description: "Single-metric arc indicator",
  },
  {
    type: "scatter",
    name: "Scatter Chart",
    description: "Correlation between two metrics",
  },
  {
    type: "gauge-arc",
    name: "Gauge Arc",
    description: "Scalar value with threshold zones",
  },
  {
    type: "wind-rose",
    name: "Wind Rose",
    description: "Directional distribution · 8 sectors",
  },
  {
    type: "compass",
    name: "Compass",
    description: "Single bearing indicator",
  },
  {
    type: "spark-bar",
    name: "Spark Bar",
    description: "Compact category snapshot",
  },
  {
    type: "timeline-heatmap",
    name: "Heatmap Matrix",
    description: "Category × time density",
  },
  {
    type: "calendar-heat",
    name: "Calendar Heatmap",
    description: "Annual daily totals",
  },
  {
    type: "bullet",
    name: "Bullet Chart",
    description: "Actual vs target with ranges",
  },
]

const DATA_KEYS = [
  "incidents_total",
  "alerts_active",
  "incidents_trend",
  "risk_score_current",
  "incident_direction",
  "incidents_by_type",
  "district_risk",
  "response_time_trend",
  "responder_readiness",
  "incident_heatmap",
  "incidents_vs_resources",
  "risk_vector_bearing",
  "incidents_calendar",
  "density_vs_pop",
  "response_vs_sla",
  "severity_snapshot",
]

export function AddBlockDrawer({
  open,
  onOpenChange,
  onAdd,
}: AddBlockDrawerProps) {
  const [step, setStep] = useState<"type" | "config">("type")
  const [selectedType, setSelectedType] = useState<ChartType | null>(null)
  const [title, setTitle] = useState("")
  const [dataKey, setDataKey] = useState(DATA_KEYS[0])

  const handleSelectType = (type: ChartType) => {
    setSelectedType(type)
    setStep("config")
  }

  const handleAdd = () => {
    if (!selectedType) return
    onAdd({
      type: selectedType,
      title: title || selectedType,
      dataKey,
      colSpan: 1,
      rowSpan: 1,
    })
    setStep("type")
    setSelectedType(null)
    setTitle("")
    setDataKey(DATA_KEYS[0])
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>
            {step === "type" ? "Select Chart Type" : "Configure Block"}
          </SheetTitle>
        </SheetHeader>

        {step === "type" ? (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {CHART_TYPES.map((chart) => (
              <button
                key={chart.type}
                onClick={() => handleSelectType(chart.type)}
                className="border-border hover:border-primary/50 hover:bg-primary/5 rounded border p-3 text-left transition"
              >
                <div className="text-sm font-medium">{chart.name}</div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {chart.description}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Block title"
                className="border-border mt-2 w-full rounded border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Data Key</label>
              <select
                value={dataKey}
                onChange={(e) => setDataKey(e.target.value)}
                className="border-border mt-2 w-full rounded border px-3 py-2 text-sm"
              >
                {DATA_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setStep("type")
                  setSelectedType(null)
                }}
                className="border-border hover:bg-muted flex-1 rounded border px-3 py-2 text-sm"
              >
                Back
              </button>
              <button
                onClick={handleAdd}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded px-3 py-2 text-sm"
              >
                Add Block
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
