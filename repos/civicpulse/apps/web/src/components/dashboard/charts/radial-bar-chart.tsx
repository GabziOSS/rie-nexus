import {
  Legend,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface RadialBarChartProps {
  data?: unknown
}

type Incident = {
  type: string
  status?: string
}

export function RadialBarChart({ data }: RadialBarChartProps) {
  const rawData = data ?? DATA_REGISTRY.incidents
  const incidents = Array.isArray(rawData) ? rawData : []

  const incidentTypes = [
    "fire",
    "flood",
    "crime",
    "medical",
    "infrastructure",
    "weather",
  ]
  const colors = [
    CHART_COLORS.fire,
    CHART_COLORS.flood,
    CHART_COLORS.crime,
    CHART_COLORS.medical,
    CHART_COLORS.infrastructure,
    CHART_COLORS.weather,
  ]

  const typeData = incidentTypes.map((type) => {
    const typeIncidents = incidents.filter((i: Incident) => i.type === type)
    const resolved = typeIncidents.filter(
      (i: Incident & { status?: string }) =>
        i.status === "resolved" || i.status === "closed"
    ).length
    const rate =
      typeIncidents.length > 0 ? (resolved / typeIncidents.length) * 100 : 0
    return {
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: Math.round(rate),
      fill: colors[incidentTypes.indexOf(type)],
    }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="30%"
        outerRadius="90%"
        barSize={20}
        data={typeData}
        startAngle={180}
        endAngle={-180}
      >
        <RadialBar
          background={{ fill: CHART_COLORS.muted, opacity: 0.2 }}
          dataKey="value"
          cornerRadius={10}
          label={{
            fill: CHART_COLORS.foreground,
            fontSize: 10,
            position: "insideStart",
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_COLORS.card,
            border: `1px solid ${CHART_COLORS.border}`,
            borderRadius: "8px",
            color: CHART_COLORS.cardForeground,
          }}
          formatter={(value) => [`${value}%`, "Resolved"]}
        />
        <Legend
          iconSize={8}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: "10px" }}
        />
      </RechartsRadialBarChart>
    </ResponsiveContainer>
  )
}
