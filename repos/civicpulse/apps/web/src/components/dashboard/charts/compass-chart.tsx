import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface CompassChartProps {
  data?: unknown
  bearing?: number
}

export function CompassChart({
  data,
  bearing: propBearing,
}: CompassChartProps) {
  const incidents = data ?? DATA_REGISTRY.incidents
  const incidentArray = Array.isArray(incidents) ? incidents : []

  const calculatedBearing =
    incidentArray.length > 0 ? Math.random() * 360 : (propBearing ?? 0)

  const bearing = propBearing ?? calculatedBearing
  const clampedBearing = bearing % 360

  const getCardinal = (deg: number): string => {
    const directions = [
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
    const index = Math.round((deg % 360) / 22.5) % 16
    return directions[index]
  }

  const cardinal = getCardinal(clampedBearing)

  const centerX = 80
  const centerY = 80
  const ringRadius = 70

  const majorTicks = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 - 90) * (Math.PI / 180)
    const x1 = centerX + (ringRadius - 8) * Math.cos(angle)
    const y1 = centerY + (ringRadius - 8) * Math.sin(angle)
    const x2 = centerX + ringRadius * Math.cos(angle)
    const y2 = centerY + ringRadius * Math.sin(angle)
    return { x1, y1, x2, y2 }
  })

  const minorTicks = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 22.5 - 90) * (Math.PI / 180)
    const x1 = centerX + (ringRadius - 4) * Math.cos(angle)
    const y1 = centerY + (ringRadius - 4) * Math.sin(angle)
    const x2 = centerX + ringRadius * Math.cos(angle)
    const y2 = centerY + ringRadius * Math.sin(angle)
    return { x1, y1, x2, y2 }
  })

  const cardinalLabels = ["N", "E", "S", "W"]
  const cardinalAngles = [0, 90, 180, 270]

  const needleAngle = (clampedBearing - 90) * (Math.PI / 180)
  const needleLength = ringRadius - 15
  const needleX = centerX + needleLength * Math.cos(needleAngle)
  const needleY = centerY + needleLength * Math.sin(needleAngle)

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <svg viewBox="0 0 160 160" className="h-full w-full">
        <circle
          cx={centerX}
          cy={centerY}
          r={ringRadius}
          fill="none"
          stroke={CHART_COLORS.border}
          strokeWidth="1"
        />

        {majorTicks.map((tick, i) => (
          <line
            key={`major-${i}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={CHART_COLORS.foreground}
            strokeWidth="1.5"
          />
        ))}

        {minorTicks.map((tick, i) => (
          <line
            key={`minor-${i}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={CHART_COLORS.muted}
            strokeWidth="0.5"
          />
        ))}

        {cardinalLabels.map((label, i) => {
          const angle = (cardinalAngles[i] - 90) * (Math.PI / 180)
          const labelRadius = ringRadius + 12
          const x = centerX + labelRadius * Math.cos(angle)
          const y = centerY + labelRadius * Math.sin(angle)
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={CHART_COLORS.foreground}
              fontSize="12"
              fontWeight="bold"
            >
              {label}
            </text>
          )
        })}

        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke={CHART_COLORS.accent}
          strokeWidth="2"
          strokeLinecap="round"
        />

        <circle
          cx={centerX}
          cy={centerY}
          r="4"
          fill={CHART_COLORS.foreground}
        />
      </svg>

      <div className="text-muted-foreground mt-2 text-center text-xs">
        {Math.round(clampedBearing)}° {cardinal}
      </div>
    </div>
  )
}
