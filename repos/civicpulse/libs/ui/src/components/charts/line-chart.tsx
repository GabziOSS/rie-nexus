"use client"

/**
 * LineChart
 * Multi-series line chart showing incident counts by type over time.
 * Each type renders as a distinct colored line.
 * Legend pills below chart toggle individual lines on/off.
 * X axis: formatted date labels. Y axis: count.
 */

import { memo, useState, useCallback, useMemo } from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import {
  AXIS_PROPS,
  TOOLTIP_STYLE,
  GRID_PROPS,
  INCIDENT_TYPE_COLORS,
} from "@rie-civicpulse/ui/lib/chart-colors"

export interface TrendPoint {
  date: string
  fire?: number
  flood?: number
  crime?: number
  medical?: number
  infrastructure?: number
  weather?: number
  [key: string]: string | number | undefined
}

export interface LineChartProps {
  data?: TrendPoint[]
  series?: string[]
  className?: string
}

const DEFAULT_SERIES = ["fire", "flood", "crime", "medical", "infrastructure", "weather"]

function LineChartComponent({ data, series = DEFAULT_SERIES, className }: LineChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([])

  // Toggle series visibility
  const handleLegendClick = useCallback((seriesKey: string) => {
    setHiddenSeries((prev) =>
      prev.includes(seriesKey)
        ? prev.filter((s) => s !== seriesKey)
        : [...prev, seriesKey]
    )
  }, [])

  // Visible series
  const visibleSeries = useMemo(
    () => series.filter((s) => !hiddenSeries.includes(s)),
    [series, hiddenSeries]
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
        No trend data available
      </div>
    )
  }

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
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
            <YAxis {...AXIS_PROPS} />
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
            />
            {series.map((seriesKey) => (
              <Line
                key={seriesKey}
                type="monotone"
                dataKey={seriesKey}
                stroke={INCIDENT_TYPE_COLORS[seriesKey] ?? "hsl(var(--primary))"}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                hide={hiddenSeries.includes(seriesKey)}
                name={seriesKey.charAt(0).toUpperCase() + seriesKey.slice(1)}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend pills */}
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {series.map((seriesKey) => {
          const isHidden = hiddenSeries.includes(seriesKey)
          const color = INCIDENT_TYPE_COLORS[seriesKey] ?? "hsl(var(--primary))"
          return (
            <button
              key={seriesKey}
              onClick={() => handleLegendClick(seriesKey)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                isHidden
                  ? "bg-muted/50 text-muted-foreground opacity-50"
                  : "bg-card text-foreground hover:brightness-110"
              )}
              style={{
                borderColor: color,
                borderWidth: 1,
                borderStyle: "solid",
              }}
              aria-pressed={!isHidden}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: isHidden ? "transparent" : color }}
              />
              {seriesKey.charAt(0).toUpperCase() + seriesKey.slice(1)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

LineChartComponent.displayName = "LineChart"

export const LineChart = memo(LineChartComponent)
export default LineChart
