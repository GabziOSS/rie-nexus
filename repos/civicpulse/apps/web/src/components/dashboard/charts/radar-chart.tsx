import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface RadarChartProps {
  data?: unknown
}

type DistrictRiskDimension = {
  district: string
  risk: number
  population?: number
}

export function RadarChart({ data }: RadarChartProps) {
  const rawData = data ?? DATA_REGISTRY.districts
  const districts = Array.isArray(rawData) ? rawData : []

  const chartData = districts.map(
    (d: DistrictRiskDimension & { name?: string }) => ({
      district: d.name || d.district,
      risk: Math.random() * 100,
      population: d.population,
    })
  )

  const colors = [
    CHART_COLORS.chart[1],
    CHART_COLORS.chart[2],
    CHART_COLORS.chart[3],
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        <PolarGrid stroke={CHART_COLORS.border} />
        <PolarAngleAxis
          dataKey="district"
          tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_COLORS.card,
            border: `1px solid ${CHART_COLORS.border}`,
            borderRadius: "8px",
            color: CHART_COLORS.cardForeground,
          }}
        />
        <Radar
          name="Risk Score"
          dataKey="risk"
          stroke={colors[0]}
          fill={colors[0]}
          fillOpacity={0.3}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}
