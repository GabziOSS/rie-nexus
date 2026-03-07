"use client"

/**
 * ComposedChart
 * Dual-axis: bars (incident count, left Y) + line (deployed responders, right Y).
 * Two YAxis components. Brush component at bottom for time range selection.
 * Shows relationship between incident volume and resource deployment.
 */

import { memo } from "react"
import {
  ComposedChart as RechartsComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  Legend,
} from "recharts"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import {
  AXIS_PROPS,
  TOOLTIP_STYLE,
  GRID_PROPS,
} from "@rie-civicpulse/ui/lib/chart-colors"

export interface ComposedDataPoint {
  date: string
  incidentCount: number
  respondersDeployed: number
}

export interface ComposedChartProps {
  data?: ComposedDataPoint[]
  /** Show brush for time range selection when rowSpan === 2 */
  rowSpan?: 1 | 2
  className?: string
}

function ComposedChartComponent({
  data,
  rowSpan = 1,
  className,
}: ComposedChartProps) {
  const showBrush = rowSpan === 2

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
        No data available
      </div>
    )
  }

  return (
    <div className={cn("h-full w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: showBrush ? 30 : 5 }}
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
          <YAxis
            yAxisId="left"
            {...AXIS_PROPS}
            label={{
              value: "Incidents",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            {...AXIS_PROPS}
            label={{
              value: "Responders",
              angle: 90,
              position: "insideRight",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10,
            }}
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
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            iconSize={12}
          />
          <Bar
            yAxisId="left"
            dataKey="incidentCount"
            fill="hsl(var(--primary))"
            fillOpacity={0.8}
            radius={[4, 4, 0, 0]}
            name="Incidents"
            barSize={20}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="respondersDeployed"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(var(--accent))" }}
            activeDot={{ r: 5 }}
            name="Responders"
          />
          {showBrush && (
            <Brush
              dataKey="date"
              height={24}
              stroke="hsl(var(--border))"
              fill="hsl(var(--muted))"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
          )}
        </RechartsComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

ComposedChartComponent.displayName = "ComposedChart"

export const ComposedChart = memo(ComposedChartComponent)
export default ComposedChart
