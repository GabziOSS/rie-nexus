"use client"

/**
 * WindRoseChart
 * 8-direction polar petal chart for incident origin spread.
 * Each direction renders stacked arc segments (bins) radiating from center.
 * Concentric reference rings at 25/50/75/100% of max radius.
 * Time range toggle below: DAY, WEEK, MONTH
 */

import { memo, useState, useCallback, useMemo } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export type TimeRange = "day" | "week" | "month"

export interface WindRoseBin {
  low: number
  mid: number
  high: number
}

export interface WindRoseDataPoint {
  direction: string
  bins: WindRoseBin
}

export interface WindRoseChartProps {
  data?: Record<TimeRange, WindRoseDataPoint[]>
  className?: string
}

const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const
const DIRECTION_ANGLES: Record<string, number> = {
  N: 270,
  NE: 315,
  E: 0,
  SE: 45,
  S: 90,
  SW: 135,
  W: 180,
  NW: 225,
}

// SVG constants
const CX = 140
const CY = 140
const MAX_RADIUS = 100
const PETAL_WIDTH = 30 // degrees

// Bin colors
const BIN_COLORS = {
  low: "hsl(var(--primary) / 0.35)",
  mid: "hsl(var(--primary) / 0.65)",
  high: "hsl(var(--accent))",
}

// Helper: polar to Cartesian
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

// Helper: generate arc path for a petal segment
function petalArcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
): string {
  const s1 = polarToCartesian(cx, cy, innerR, startAngle)
  const e1 = polarToCartesian(cx, cy, innerR, endAngle)
  const s2 = polarToCartesian(cx, cy, outerR, startAngle)
  const e2 = polarToCartesian(cx, cy, outerR, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return `
    M ${s1.x} ${s1.y}
    L ${s2.x} ${s2.y}
    A ${outerR} ${outerR} 0 ${largeArc} 1 ${e2.x} ${e2.y}
    L ${e1.x} ${e1.y}
    A ${innerR} ${innerR} 0 ${largeArc} 0 ${s1.x} ${s1.y}
    Z
  `
}

function WindRoseChartComponent({ data, className }: WindRoseChartProps) {
  const [range, setRange] = useState<TimeRange>("week")

  const handleRangeChange = useCallback((newRange: TimeRange) => {
    setRange(newRange)
  }, [])

  // Get max value for scaling
  const maxValue = useMemo(() => {
    if (!data) return 100
    const rangeData = data[range] ?? []
    let max = 0
    for (const point of rangeData) {
      const total = point.bins.low + point.bins.mid + point.bins.high
      if (total > max) max = total
    }
    return max || 100
  }, [data, range])

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

  const rangeData = data[range] ?? []

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="flex-1">
        <svg
          viewBox="0 0 280 280"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Reference rings */}
          {[25, 50, 75, 100].map((pct) => (
            <circle
              key={pct}
              cx={CX}
              cy={CY}
              r={(pct / 100) * MAX_RADIUS}
              fill="none"
              stroke="hsl(var(--border))"
              strokeOpacity={0.3}
              strokeDasharray="2 4"
            />
          ))}

          {/* Petals for each direction */}
          {rangeData.map((point) => {
            const angle = DIRECTION_ANGLES[point.direction] ?? 0
            const startAngle = angle - PETAL_WIDTH / 2
            const endAngle = angle + PETAL_WIDTH / 2
            const total = point.bins.low + point.bins.mid + point.bins.high

            // Calculate radii for stacked bins
            const lowRadius = (point.bins.low / maxValue) * MAX_RADIUS
            const midRadius =
              ((point.bins.low + point.bins.mid) / maxValue) * MAX_RADIUS
            const highRadius = (total / maxValue) * MAX_RADIUS

            return (
              <g key={point.direction}>
                {/* Low bin */}
                {point.bins.low > 0 && (
                  <path
                    d={petalArcPath(CX, CY, 0, lowRadius, startAngle, endAngle)}
                    fill={BIN_COLORS.low}
                  />
                )}
                {/* Mid bin */}
                {point.bins.mid > 0 && (
                  <path
                    d={petalArcPath(
                      CX,
                      CY,
                      lowRadius,
                      midRadius,
                      startAngle,
                      endAngle
                    )}
                    fill={BIN_COLORS.mid}
                  />
                )}
                {/* High bin */}
                {point.bins.high > 0 && (
                  <path
                    d={petalArcPath(
                      CX,
                      CY,
                      midRadius,
                      highRadius,
                      startAngle,
                      endAngle
                    )}
                    fill={BIN_COLORS.high}
                  />
                )}
              </g>
            )
          })}

          {/* Cardinal labels */}
          {DIRECTIONS.map((dir) => {
            const angle = DIRECTION_ANGLES[dir]
            const labelR = 115
            const pos = polarToCartesian(CX, CY, labelR, angle)
            return (
              <text
                key={dir}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="hsl(var(--muted-foreground))"
                fontSize={11}
              >
                {dir}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Time range pills */}
      <div className="mt-2 flex justify-center gap-2">
        {(["day", "week", "month"] as const).map((r) => (
          <button
            key={r}
            onClick={() => handleRangeChange(r)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium uppercase transition-all",
              range === r
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-pressed={range === r}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}

WindRoseChartComponent.displayName = "WindRoseChart"

export const WindRoseChart = memo(WindRoseChartComponent)
export default WindRoseChart
