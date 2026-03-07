"use client"

/**
 * AreaChart
 * Response time trend with stacked gradient areas.
 * Two series: avgMinutes (primary) and p90Minutes (accent, 40% opacity).
 * Reference line at y=10 (SLA target) — dashed accent.
 * Gradient fill fades to transparent at bottom.
 */

import { memo, useMemo } from "react"
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import {
  AXIS_PROPS,
  TOOLTIP_STYLE,
  GRID_PROPS,
} from "@rie-civicpulse/ui/lib/chart-colors"

export interface ResponseTimePoint {
  date: string
  avgMinutes: number
  p90Minutes: number
}

export interface AreaChartProps {
  data?: ResponseTimePoint[]
  slaTarget?: number
  className?: string
}

function AreaChartComponent({
  data,
  slaTarget = 10,
  className,
}: AreaChartProps) {
  // Generate unique gradient IDs to avoid conflicts when multiple charts render
  const gradientIds = useMemo(
    () => ({
      avg: `avgGradient-${Math.random().toString(36).slice(2, 9)}`,
      p90: `p90Gradient-${Math.random().toString(36).slice(2, 9)}`,
    }),
    []
  )

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
        No response time data available
      </div>
    )
  }

  return (
    <div className={cn("h-full w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id={gradientIds.avg} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.02}
              />
            </linearGradient>
            <linearGradient id={gradientIds.p90} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--accent))"
                stopOpacity={0.2}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--accent))"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            dataKey="date"
            {...AXIS_PROPS}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }}
          />
          <YAxis
            {...AXIS_PROPS}
            tickFormatter={(value) => `${value}m`}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelFormatter={(label) => {
              const date = new Date(label)
              return date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)} min`,
              name === "avgMinutes" ? "Avg Response" : "P90 Response",
            ]}
          />
          <ReferenceLine
            y={slaTarget}
            stroke="hsl(var(--accent))"
            strokeDasharray="4 4"
            label={{
              value: `SLA ${slaTarget}m`,
              fill: "hsl(var(--accent))",
              fontSize: 11,
              position: "right",
            }}
          />
          <Area
            type="monotone"
            dataKey="p90Minutes"
            stroke="hsl(var(--accent))"
            strokeWidth={1.5}
            fill={`url(#${gradientIds.p90})`}
            fillOpacity={0.4}
            name="P90"
          />
          <Area
            type="monotone"
            dataKey="avgMinutes"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill={`url(#${gradientIds.avg})`}
            name="Average"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}

AreaChartComponent.displayName = "AreaChart"

export const AreaChart = memo(AreaChartComponent)
export default AreaChart
