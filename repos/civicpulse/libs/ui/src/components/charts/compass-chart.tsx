"use client"

/**
 * CompassChart
 * Single needle compass showing dominant risk vector bearing.
 * Ring with 8 major ticks + 16 minor ticks.
 * Cardinal labels: N E S W.
 * Two needles (N/S triangle) rotate together to bearing.
 * Bearing text + derived cardinal label below SVG.
 */

import { memo, useState, useEffect, useMemo } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export interface CompassChartProps {
  /** Bearing in degrees (0-360), 0 = North */
  bearing?: number
  className?: string
}

// SVG constants
const CX = 80
const CY = 80
const RING_RADIUS = 70

// Convert bearing to cardinal direction
function bearingToCardinal(degrees: number): string {
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  return dirs[Math.round(degrees / 22.5) % 16]
}

function CompassChartComponent({ bearing, className }: CompassChartProps) {
  // Animated bearing
  const [displayBearing, setDisplayBearing] = useState(0)

  useEffect(() => {
    if (bearing === undefined) return
    const timer = setTimeout(() => setDisplayBearing(bearing), 100)
    return () => clearTimeout(timer)
  }, [bearing])

  // Generate tick marks
  const ticks = useMemo(() => {
    const result: { angle: number; isMajor: boolean }[] = []
    // 8 major ticks at 0, 45, 90, etc.
    for (let i = 0; i < 8; i++) {
      result.push({ angle: i * 45, isMajor: true })
    }
    // 16 minor ticks between majors
    for (let i = 0; i < 16; i++) {
      const angle = i * 22.5
      if (angle % 45 !== 0) {
        result.push({ angle, isMajor: false })
      }
    }
    return result
  }, [])

  // Loading state
  if (bearing === undefined) {
    return (
      <div
        className={cn(
          "h-full w-full animate-pulse rounded-lg bg-muted/30",
          className
        )}
      />
    )
  }

  const cardinalDirection = bearingToCardinal(displayBearing)

  return (
    <div className={cn("flex h-full w-full flex-col items-center", className)}>
      <div className="flex-1">
        <svg
          viewBox="0 0 160 160"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Outer ring */}
          <circle
            cx={CX}
            cy={CY}
            r={RING_RADIUS}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={2}
          />

          {/* Tick marks */}
          {ticks.map(({ angle, isMajor }) => {
            const rad = ((angle - 90) * Math.PI) / 180
            const r1 = isMajor ? 62 : 65
            const r2 = 70
            const x1 = CX + r1 * Math.cos(rad)
            const y1 = CY + r1 * Math.sin(rad)
            const x2 = CX + r2 * Math.cos(rad)
            const y2 = CY + r2 * Math.sin(rad)
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--border))"
                strokeWidth={isMajor ? 2 : 1}
              />
            )
          })}

          {/* Cardinal labels */}
          {[
            { label: "N", angle: 0 },
            { label: "E", angle: 90 },
            { label: "S", angle: 180 },
            { label: "W", angle: 270 },
          ].map(({ label, angle }) => {
            const rad = ((angle - 90) * Math.PI) / 180
            const r = 52
            const x = CX + r * Math.cos(rad)
            const y = CY + r * Math.sin(rad)
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="hsl(var(--muted-foreground))"
                fontSize={12}
                fontWeight={500}
              >
                {label}
              </text>
            )
          })}

          {/* Needle group (rotates together) */}
          <g
            style={{
              transform: `rotate(${displayBearing}deg)`,
              transformOrigin: `${CX}px ${CY}px`,
              transition: "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* North needle (accent color) */}
            <polygon
              points={`${CX},${CY - 40} ${CX - 6},${CY} ${CX + 6},${CY}`}
              fill="hsl(var(--accent))"
            />
            {/* South needle (muted) */}
            <polygon
              points={`${CX},${CY + 40} ${CX - 6},${CY} ${CX + 6},${CY}`}
              fill="hsl(var(--muted-foreground))"
            />
          </g>

          {/* Center dot */}
          <circle
            cx={CX}
            cy={CY}
            r={6}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* Bearing text */}
      <div className="mt-1 text-center">
        <span
          className="text-lg font-bold tabular-nums text-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {displayBearing.toFixed(0)}°
        </span>
        <span className="ml-2 text-sm text-muted-foreground">
          {cardinalDirection}
        </span>
      </div>
    </div>
  )
}

CompassChartComponent.displayName = "CompassChart"

export const CompassChart = memo(CompassChartComponent)
export default CompassChart
