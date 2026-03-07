"use client"

/**
 * RadialBarChart
 * Single arc showing % of incidents resolved.
 * Arc spans 0–360. Center shows percentage + "Resolved".
 * Background track in muted color.
 */

import { memo, useMemo } from "react"
import {
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export interface RadialBarChartProps {
  /** Value as percentage (0-100) */
  value?: number
  /** Label shown below percentage */
  label?: string
  className?: string
}

function RadialBarChartComponent({
  value,
  label = "Resolved",
  className,
}: RadialBarChartProps) {
  // Loading state
  if (value === undefined) {
    return (
      <div
        className={cn(
          "h-full w-full animate-pulse rounded-lg bg-muted/30",
          className
        )}
      />
    )
  }

  // Clamp value between 0-100
  const clampedValue = Math.max(0, Math.min(100, value))

  // Data for radial bar
  const data = useMemo(
    () => [
      { name: "resolved", value: clampedValue, fill: "hsl(var(--success))" },
    ],
    [clampedValue]
  )

  return (
    <div className={cn("relative h-full w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={12}
        >
          {/* Background track */}
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
            dataKey="value"
            cornerRadius={6}
            fill="hsl(var(--success))"
          />
        </RechartsRadialBarChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[28px] font-bold tabular-nums text-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {clampedValue.toFixed(0)}%
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

RadialBarChartComponent.displayName = "RadialBarChart"

export const RadialBarChart = memo(RadialBarChartComponent)
export default RadialBarChart
