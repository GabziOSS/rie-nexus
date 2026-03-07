import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import type { Incident } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface GaugeArcChartProps {
  data?: unknown
  value?: number
}

export function GaugeArcChart({ data, value: propValue }: GaugeArcChartProps) {
  const incidents = data ?? DATA_REGISTRY.incidents
  const incidentArray = Array.isArray(incidents) ? incidents : []

  const resolvedIncidents = incidentArray.filter(
    (i: Incident) => i.status === "resolved" || i.status === "closed"
  ).length
  const totalIncidents = incidentArray.length
  const calculatedValue =
    totalIncidents > 0
      ? Math.round((resolvedIncidents / totalIncidents) * 100)
      : 0

  const value = propValue ?? calculatedValue
  const clampedValue = Math.max(0, Math.min(100, value))

  const centerX = 100
  const centerY = 100
  const radius = 80
  const largeArcFlag = 0

  const getArcEndpoint = (angle: number): { x: number; y: number } => {
    const radians = (angle * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    }
  }

  const createArcPath = (
    startDeg: number,
    endDeg: number,
    r: number
  ): string => {
    const start = getArcEndpoint(startDeg)
    const end = getArcEndpoint(endDeg)
    const sweep = endDeg > startDeg ? 1 : 0
    return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${r} ${r}
      0 ${largeArcFlag} ${sweep} ${end.x} ${end.y} Z`
  }

  const segment1Path = createArcPath(180, 120, radius)
  const segment2Path = createArcPath(120, 60, radius)
  const segment3Path = createArcPath(60, 0, radius)

  const needleAngle = 180 - (clampedValue / 100) * 180
  const needleLength = radius - 15
  const needleX =
    centerX + needleLength * Math.cos((needleAngle * Math.PI) / 180)
  const needleY =
    centerY + needleLength * Math.sin((needleAngle * Math.PI) / 180)

  return (
    <svg
      viewBox="0 0 200 120"
      className="h-full w-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <path d={segment1Path} fill={CHART_COLORS.success} opacity={0.3} />
      <path d={segment2Path} fill={CHART_COLORS.warning} opacity={0.3} />
      <path d={segment3Path} fill={CHART_COLORS.fire} opacity={0.3} />

      <path
        d={createArcPath(180, 180 - (clampedValue / 100) * 180, radius - 5)}
        fill="none"
        stroke={
          clampedValue >= 70
            ? CHART_COLORS.success
            : clampedValue >= 40
              ? CHART_COLORS.warning
              : CHART_COLORS.fire
        }
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      <circle cx={centerX} cy={centerY} r="8" fill={CHART_COLORS.foreground} />

      <line
        x1={centerX}
        y1={centerY}
        x2={needleX}
        y2={needleY}
        stroke={CHART_COLORS.foreground}
        strokeWidth="2"
        strokeLinecap="round"
      />

      <text
        x={centerX}
        y={centerY + 25}
        textAnchor="middle"
        fill={CHART_COLORS.foreground}
        fontSize="20"
        fontWeight="bold"
      >
        {clampedValue}%
      </text>

      <text x="20" y="110" fill={CHART_COLORS.muted} fontSize="8">
        0
      </text>
      <text x="90" y="15" fill={CHART_COLORS.muted} fontSize="8">
        50
      </text>
      <text x="170" y="110" fill={CHART_COLORS.muted} fontSize="8">
        100
      </text>
    </svg>
  )
}
