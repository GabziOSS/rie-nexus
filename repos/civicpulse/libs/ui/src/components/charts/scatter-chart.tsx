"use client"

/**
 * ScatterChart
 * One point per zone: x = population, y = incident count.
 * Dot size proportional to zone area_km2.
 * Dot color by risk level (destructive/warning/primary/success).
 * Reference lines at mean x and mean y.
 * Zone name tooltip on hover.
 */

import { memo, useMemo } from "react"
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  ZAxis,
} from "recharts"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import {
  AXIS_PROPS,
  TOOLTIP_STYLE,
  GRID_PROPS,
  SEVERITY_COLORS,
} from "@rie-civicpulse/ui/lib/chart-colors"

export type RiskLevel = "critical" | "high" | "medium" | "low"

export interface ScatterDataPoint {
  zoneName: string
  population: number
  incidentCount: number
  areaKm2: number
  riskLevel: RiskLevel
}

export interface ScatterChartProps {
  data?: ScatterDataPoint[]
  className?: string
}

// Custom tooltip content
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ScatterDataPoint }>
}) => {
  if (!active || !payload || payload.length === 0) return null

  const item = payload[0].payload

  return (
    <div
      style={{
        ...TOOLTIP_STYLE,
        padding: "8px 12px",
      }}
    >
      <p className="mb-1 font-medium text-foreground">{item.zoneName}</p>
      <div className="space-y-0.5 text-xs">
        <p>Population: {item.population.toLocaleString()}</p>
        <p>Incidents: {item.incidentCount}</p>
        <p>Area: {item.areaKm2.toFixed(1)} km²</p>
        <p className="mt-1 capitalize">Risk: {item.riskLevel}</p>
      </div>
    </div>
  )
}

function ScatterChartComponent({ data, className }: ScatterChartProps) {
  // Calculate mean values for reference lines
  const { meanX, meanY, sizeRange } = useMemo(() => {
    if (!data || data.length === 0) {
      return { meanX: 0, meanY: 0, sizeRange: [10, 30] }
    }

    const totalPopulation = data.reduce((sum, d) => sum + d.population, 0)
    const totalIncidents = data.reduce((sum, d) => sum + d.incidentCount, 0)
    const areas = data.map((d) => d.areaKm2)
    const minArea = Math.min(...areas)
    const maxArea = Math.max(...areas)

    return {
      meanX: totalPopulation / data.length,
      meanY: totalIncidents / data.length,
      sizeRange: [minArea, maxArea],
    }
  }, [data])

  // Get color for risk level
  const getRiskColor = (level: RiskLevel) => {
    return SEVERITY_COLORS[level] ?? "hsl(var(--primary))"
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
        No zone data available
      </div>
    )
  }

  return (
    <div className={cn("h-full w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart
          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
        >
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            type="number"
            dataKey="population"
            name="Population"
            {...AXIS_PROPS}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            label={{
              value: "Population",
              position: "bottom",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10,
            }}
          />
          <YAxis
            type="number"
            dataKey="incidentCount"
            name="Incidents"
            {...AXIS_PROPS}
            label={{
              value: "Incidents",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10,
            }}
          />
          <ZAxis
            type="number"
            dataKey="areaKm2"
            range={[50, 400]}
            name="Area"
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            x={meanX}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <ReferenceLine
            y={meanY}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <Scatter name="Zones" data={data}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getRiskColor(entry.riskLevel)}
                fillOpacity={0.7}
                stroke="hsl(var(--border))"
                strokeWidth={1}
              />
            ))}
          </Scatter>
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

ScatterChartComponent.displayName = "ScatterChart"

export const ScatterChart = memo(ScatterChartComponent)
export default ScatterChart
