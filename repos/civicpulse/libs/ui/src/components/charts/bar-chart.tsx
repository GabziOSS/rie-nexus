"use client"

/**
 * BarChart
 * Incident counts grouped by type.
 * Horizontal orientation when colSpan === 1.
 * Vertical orientation when colSpan >= 2.
 * Rounded bar caps. Value labels at bar ends.
 */

import { memo } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import {
  AXIS_PROPS,
  TOOLTIP_STYLE,
  GRID_PROPS,
  INCIDENT_TYPE_COLORS,
} from "@rie-civicpulse/ui/lib/chart-colors"

export interface BarDataPoint {
  name: string
  value: number
  type?: string
}

export interface BarChartProps {
  data?: BarDataPoint[]
  /** Controls orientation: horizontal if 1, vertical if >= 2 */
  colSpan?: 1 | 2 | 3
  className?: string
  /** Custom color mapping, falls back to incident type colors or primary */
  colorMap?: Record<string, string>
}

function BarChartComponent({
  data,
  colSpan = 2,
  className,
  colorMap,
}: BarChartProps) {
  const isHorizontal = colSpan === 1

  // Loading state
  if (!data) {
    return (
      <div
        className={cn(
          "bg-muted/30 h-full w-full animate-pulse rounded-lg",
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
          "text-muted-foreground flex h-full w-full items-center justify-center",
          className
        )}
      >
        No data available
      </div>
    )
  }

  // Get color for a bar
  const getBarColor = (item: BarDataPoint) => {
    if (colorMap?.[item.name]) return colorMap[item.name]
    if (item.type && INCIDENT_TYPE_COLORS[item.type]) {
      return INCIDENT_TYPE_COLORS[item.type]
    }
    if (item.name && INCIDENT_TYPE_COLORS[item.name.toLowerCase()]) {
      return INCIDENT_TYPE_COLORS[item.name.toLowerCase()]
    }
    return "hsl(var(--primary))"
  }

  if (isHorizontal) {
    // Horizontal bar chart (for narrow column)
    return (
      <div className={cn("h-full w-full", className)}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
          >
            <CartesianGrid {...GRID_PROPS} horizontal={false} />
            <XAxis type="number" {...AXIS_PROPS} />
            <YAxis
              type="category"
              dataKey="name"
              {...AXIS_PROPS}
              width={80}
              tickFormatter={(value) =>
                value.length > 10 ? value.slice(0, 10) + "..." : value
              }
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fill="hsl(var(--muted-foreground))"
                fontSize={11}
                fontFamily="var(--font-mono)"
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Vertical bar chart (for wider columns)
  return (
    <div className={cn("h-full w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid {...GRID_PROPS} vertical={false} />
          <XAxis
            dataKey="name"
            {...AXIS_PROPS}
            tickFormatter={(value) =>
              value.length > 8 ? value.slice(0, 8) + "..." : value
            }
          />
          <YAxis {...AXIS_PROPS} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
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
    </div>
  )
}

BarChartComponent.displayName = "BarChart"

export const BarChart = memo(BarChartComponent)
export default BarChart
