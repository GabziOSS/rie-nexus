"use client"

/**
 * PieChart (Donut)
 * Severity distribution as a donut chart.
 * Center label shows total count.
 * Active segment expands on hover.
 * No legend — colors and labels on segments.
 */

import { memo, useState, useCallback, useMemo } from "react"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import {
  TOOLTIP_STYLE,
  SEVERITY_COLORS,
} from "@rie-civicpulse/ui/lib/chart-colors"

export interface PieDataPoint {
  name: string
  value: number
  color?: string
}

export interface PieChartProps {
  data?: PieDataPoint[]
  className?: string
  /** Label shown in center below total */
  centerLabel?: string
}

// Render active shape with expanded outer radius
const renderActiveShape = (props: {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: PieDataPoint
  percent: number
  value: number
}) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: "brightness(1.1)" }}
      />
    </g>
  )
}

function PieChartComponent({
  data,
  className,
  centerLabel = "Total",
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  // Calculate total
  const total = useMemo(
    () => (data ?? []).reduce((sum, item) => sum + item.value, 0),
    [data]
  )

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index)
  }, [])

  const onPieLeave = useCallback(() => {
    setActiveIndex(undefined)
  }, [])

  // Get color for segment
  const getSegmentColor = (item: PieDataPoint) => {
    if (item.color) return item.color
    const key = item.name.toLowerCase()
    if (SEVERITY_COLORS[key]) return SEVERITY_COLORS[key]
    return "hsl(var(--primary))"
  }

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
        No severity data available
      </div>
    )
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            activeIndex={activeIndex}
            activeShape={renderActiveShape as unknown as undefined}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getSegmentColor(entry)}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: number, name: string) => [
              `${value} incidents`,
              name,
            ]}
          />
        </RechartsPieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-2xl font-bold tabular-nums text-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {total.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">{centerLabel}</span>
      </div>
    </div>
  )
}

PieChartComponent.displayName = "PieChart"

export const PieChart = memo(PieChartComponent)
export default PieChart
