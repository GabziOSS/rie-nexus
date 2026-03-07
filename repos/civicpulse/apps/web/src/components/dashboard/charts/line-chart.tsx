import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface LineChartProps {
  data?: unknown
}

type TrendPoint = {
  date: string
  value: number
  type?: string
}

export function LineChart({ data }: LineChartProps) {
  const rawData = data ?? DATA_REGISTRY.trends
  const trends = Array.isArray(rawData) ? rawData : []

  const period365 = trends.find(
    (t: TrendPoint & { period?: string }) =>
      "period" in t && (t as { period: string }).period === "365d"
  )
  const chartData =
    period365 && "data" in period365
      ? (period365 as { data: Array<TrendPoint> }).data
      : trends

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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
        <XAxis
          dataKey="date"
          stroke={CHART_COLORS.muted}
          tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
          tickFormatter={(value) => {
            const date = new Date(value)
            return `${date.getMonth() + 1}/${date.getDate()}`
          }}
        />
        <YAxis
          stroke={CHART_COLORS.muted}
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
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {incidentTypes.slice(0, 4).map((type, index) => (
          <Line
            key={type}
            type="monotone"
            dataKey={type}
            stroke={colors[index]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
