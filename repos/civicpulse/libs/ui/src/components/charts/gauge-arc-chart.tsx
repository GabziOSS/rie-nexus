"use client"

/**
 * GaugeArcChart
 * Semicircle needle gauge for scalar values (0–max).
 * Three colored arc segments at threshold breakpoints.
 * Needle animates to value on mount with spring easing.
 * Center text shows value + unit.
 */

import { memo, useState, useEffect, useMemo } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export interface GaugeArcChartProps {
  /** Current value */
  value?: number
  /** Thresholds: { low, high, max } */
  thresholds?: {
    low: number
    high: number
    max: number
  }
  /** Unit label (e.g., "min", "%") */
  unit?: string
  className?: string
}

// SVG helper: convert polar to Cartesian
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 180) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

// SVG helper: generate arc path
function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  const s = polarToCartesian(cx, cy, r, startDeg)
  const e = polarToCartesian(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}

const DEFAULT_THRESHOLDS = { low: 30, high: 70, max: 100 }

function GaugeArcChartComponent({
  value,
  thresholds = DEFAULT_THRESHOLDS,
  unit = "",
  className,
}: GaugeArcChartProps) {
  // Animated display value
  const [displayValue, setDisplayValue] = useState(0)

  // Animate on mount
  useEffect(() => {
    if (value === undefined) return
    const timer = setTimeout(() => setDisplayValue(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  // Calculate arc segments
  const { lowEndDeg, highEndDeg, needleAngle } = useMemo(() => {
    const max = thresholds.max || 100
    return {
      lowEndDeg: (thresholds.low / max) * 180,
      highEndDeg: (thresholds.high / max) * 180,
      needleAngle: (displayValue / max) * 180,
    }
  }, [thresholds, displayValue])

  // SVG constants
  const cx = 100
  const cy = 110
  const r = 80

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

  return (
    <div className={cn("relative h-full w-full", className)}>
      <svg
        viewBox="0 0 200 120"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background arc (full 180°) */}
        <path
          d={arcPath(cx, cy, r, 0, 180)}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={10}
          strokeOpacity={0.3}
          strokeLinecap="round"
        />

        {/* Green arc: 0 → low threshold */}
        <path
          d={arcPath(cx, cy, r, 0, lowEndDeg)}
          fill="none"
          stroke="hsl(var(--success))"
          strokeWidth={10}
          strokeLinecap="round"
        />

        {/* Amber arc: low → high threshold */}
        <path
          d={arcPath(cx, cy, r, lowEndDeg, highEndDeg)}
          fill="none"
          stroke="hsl(var(--warning))"
          strokeWidth={10}
          strokeLinecap="round"
        />

        {/* Red arc: high → max */}
        <path
          d={arcPath(cx, cy, r, highEndDeg, 180)}
          fill="none"
          stroke="hsl(var(--destructive))"
          strokeWidth={10}
          strokeLinecap="round"
        />

        {/* Needle */}
        <g
          style={{
            transform: `rotate(${needleAngle}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: "transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <polygon
            points={`${cx},${cy - 65} ${cx - 4},${cy} ${cx + 4},${cy}`}
            fill="hsl(var(--foreground))"
          />
        </g>

        {/* Center dot */}
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth={2}
        />

        {/* Center text: value */}
        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize={28}
          fontWeight="bold"
          fontFamily="var(--font-mono)"
        >
          {displayValue.toFixed(0)}
        </text>

        {/* Center text: unit */}
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize={11}
        >
          {unit}
        </text>
      </svg>
    </div>
  )
}

GaugeArcChartComponent.displayName = "GaugeArcChart"

export const GaugeArcChart = memo(GaugeArcChartComponent)
export default GaugeArcChart
