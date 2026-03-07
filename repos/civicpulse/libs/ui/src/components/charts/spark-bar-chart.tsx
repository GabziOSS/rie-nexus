"use client"

/**
 * SparkBarChart
 * Minimal bar chart — 4 bars for severity counts.
 * No axes, no grid, no legend.
 * Value labels above bars.
 * Used for dense KPI contexts.
 */

import { memo } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import { SEVERITY_COLORS } from "@rie-civicpulse/ui/lib/chart-colors"

export interface SparkBarDataPoint {
  name: string
  value: number
}

export interface SparkBarChartProps {
  data?: SparkBarDataPoint[]
  className?: string
  /** Fixed height in pixels, default 120 */
  height?: number
}

const DEFAULT_DATA: SparkBarDataPoint[] = [
  { name: "critical", value: 0 },
  { name: "high", value: 0 },
  { name: "medium", value: 0 },
  { name: "low", value: 0 },
]

function SparkBarChartComponent({
  data,
  className,
  height = 120,
}: SparkBarChartProps) {
  // Loading state
  if (!data) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-lg bg-muted/30",
          className
        )}
        style={{ height }}
      />
    )
  }

  // Use provided data or default
  const chartData = data.length > 0 ? data : DEFAULT_DATA

  // Get color for bar based on name
  const getBarColor = (name: string) => {
    const key = name.toLowerCase()
    return SEVERITY_COLORS[key] ?? "hsl(var(--primary))"
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          margin={{ top: 20, right: 5, bottom: 5, left: 5 }}
        >
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              fill="hsl(var(--muted-foreground))"
              fontSize={11}
              fontFamily="var(--font-mono)"
            />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>

      {/* Labels below */}
      <div className="flex justify-around px-1 text-[10px] text-muted-foreground">
        {chartData.map((entry) => (
          <span key={entry.name} className="capitalize">
            {entry.name.slice(0, 4)}
          </span>
        ))}
      </div>
    </div>
  )
}

SparkBarChartComponent.displayName = "SparkBarChart"

export const SparkBarChart = memo(SparkBarChartComponent)
export default SparkBarChart
