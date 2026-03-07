import { useState } from "react"
import { CHART_COLORS } from "@/lib/chart-colors"

interface WindRoseChartProps {
  data?: unknown
}

type Period = "DAY" | "WEEK" | "MONTH"

const DIRECTION_DATA: Record<Period, Record<string, number>> = {
  DAY: {
    N: 12,
    NE: 8,
    E: 15,
    SE: 22,
    S: 18,
    SW: 10,
    W: 8,
    NW: 7,
  },
  WEEK: {
    N: 45,
    NE: 32,
    E: 58,
    SE: 85,
    S: 72,
    SW: 48,
    W: 35,
    NW: 40,
  },
  MONTH: {
    N: 180,
    NE: 145,
    E: 240,
    SE: 320,
    S: 285,
    SW: 195,
    W: 160,
    NW: 175,
  },
}

const DIRECTION_LABELS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
const DIRECTION_DEGREES: Record<string, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
}

export function WindRoseChart({ data }: WindRoseChartProps) {
  const [period, setPeriod] = useState<Period>("DAY")

  const directionData = data as Record<string, number> | undefined
  const activeData = directionData ?? DIRECTION_DATA[period]

  const maxValue = Math.max(
    ...Object.values(data ? activeData : DIRECTION_DATA[period])
  )

  const centerX = 140
  const centerY = 140
  const innerRadius = 35
  const outerRadius = 110
  const ringCount = 4

  const getPointOnCircle = (
    degrees: number,
    radius: number
  ): { x: number; y: number } => {
    const radians = ((degrees - 90) * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    }
  }

  const createPetalPath = (direction: string): string => {
    const angle = DIRECTION_DEGREES[direction]
    const halfWidth = 12

    const midPoint = getPointOnCircle(
      angle,
      innerRadius + (outerRadius - innerRadius) * 0.5
    )

    const leftAngle = angle - halfWidth
    const rightAngle = angle + halfWidth

    const leftInner = getPointOnCircle(leftAngle, innerRadius)
    const leftOuter = getPointOnCircle(leftAngle, outerRadius)
    const rightInner = getPointOnCircle(rightAngle, innerRadius)
    const rightOuter = getPointOnCircle(rightAngle, outerRadius)

    return `
      M ${leftInner.x} ${leftInner.y}
      L ${leftOuter.x} ${leftOuter.y}
      Q ${midPoint.x} ${midPoint.y} ${rightOuter.x} ${rightOuter.y}
      L ${rightInner.x} ${rightInner.y}
      Q ${midPoint.x} ${midPoint.y} ${leftInner.x} ${leftInner.y}
      Z
    `
  }

  const rings = Array.from({ length: ringCount }, (_, i) => {
    const r = innerRadius + ((outerRadius - innerRadius) / ringCount) * (i + 1)
    return (
      <circle
        key={`ring-${i}`}
        cx={centerX}
        cy={centerY}
        r={r}
        fill="none"
        stroke={CHART_COLORS.border}
        strokeWidth="0.5"
        opacity={0.3}
      />
    )
  })

  const directionLabels = DIRECTION_LABELS.map((dir) => {
    const angle = DIRECTION_DEGREES[dir]
    const point = getPointOnCircle(angle, outerRadius + 12)
    return (
      <text
        key={dir}
        x={point.x}
        y={point.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={CHART_COLORS.muted}
        fontSize="10"
        fontWeight="500"
      >
        {dir}
      </text>
    )
  })

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex justify-center gap-1">
        {(["DAY", "WEEK", "MONTH"] as Array<Period>).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded px-3 py-1 text-xs transition-colors ${
              period === p
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 280 280" className="h-full w-full">
        {rings}

        {DIRECTION_LABELS.map((dir, index) => {
          const value = activeData[dir] || 0
          const colorKey = (index + 1) as keyof typeof CHART_COLORS.chart
          const color = CHART_COLORS.chart[colorKey] || CHART_COLORS.primary
          const opacity = 0.3 + (value / maxValue) * 0.7

          return (
            <path
              key={dir}
              d={createPetalPath(dir)}
              fill={color}
              opacity={opacity}
              stroke={color}
              strokeWidth="1"
            />
          )
        })}

        {directionLabels}

        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius - 5}
          fill={CHART_COLORS.card}
          stroke={CHART_COLORS.border}
          strokeWidth="1"
        />

        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          fill={CHART_COLORS.foreground}
          fontSize="12"
          fontWeight="bold"
        >
          {Math.round(
            Object.values(activeData).reduce((a, b) => a + b, 0) /
              Object.values(activeData).length
          )}
        </text>
        <text
          x={centerX}
          y={centerY + 8}
          textAnchor="middle"
          fill={CHART_COLORS.muted}
          fontSize="8"
        >
          avg
        </text>
      </svg>
    </div>
  )
}
