"use client"

/**
 * RadarChart
 * District risk comparison across 5 dimensions:
 * Incident Rate, Infrastructure, Population Density, Flood Risk, Crime Index
 * One radar per district, semi-transparent filled areas.
 * PolarGrid with polygon gridType.
 */

import { memo, useState, useCallback, useMemo } from "react"
import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import { TOOLTIP_STYLE } from "@rie-civicpulse/ui/lib/chart-colors"

export interface RadarDataPoint {
  dimension: string
  [district: string]: string | number
}

export interface RadarChartProps {
  data?: RadarDataPoint[]
  districts?: string[]
  className?: string
}

// District colors - cycling through theme colors
const DISTRICT_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--destructive))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(270 75% 65%)",
]

function RadarChartComponent({
  data,
  districts = [],
  className,
}: RadarChartProps) {
  const [hiddenDistricts, setHiddenDistricts] = useState<string[]>([])

  // Toggle district visibility
  const handleLegendClick = useCallback((district: string) => {
    setHiddenDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    )
  }, [])

  // Auto-detect districts from data if not provided
  const detectedDistricts = useMemo(() => {
    if (districts.length > 0) return districts
    if (!data || data.length === 0) return []
    const keys = Object.keys(data[0]).filter((k) => k !== "dimension")
    return keys
  }, [data, districts])

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
        No risk data available
      </div>
    )
  }

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart
            data={data}
            margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          >
            <PolarGrid
              gridType="polygon"
              stroke="hsl(var(--border))"
              strokeOpacity={0.4}
            />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 9,
              }}
              tickCount={5}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            {detectedDistricts.map((district, index) => (
              <Radar
                key={district}
                name={district}
                dataKey={district}
                stroke={DISTRICT_COLORS[index % DISTRICT_COLORS.length]}
                fill={DISTRICT_COLORS[index % DISTRICT_COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={1.5}
                hide={hiddenDistricts.includes(district)}
              />
            ))}
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {detectedDistricts.map((district, index) => {
          const isHidden = hiddenDistricts.includes(district)
          const color = DISTRICT_COLORS[index % DISTRICT_COLORS.length]
          return (
            <button
              key={district}
              onClick={() => handleLegendClick(district)}
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
              {district}
            </button>
          )
        })}
      </div>
    </div>
  )
}

RadarChartComponent.displayName = "RadarChart"

export const RadarChart = memo(RadarChartComponent)
export default RadarChart
