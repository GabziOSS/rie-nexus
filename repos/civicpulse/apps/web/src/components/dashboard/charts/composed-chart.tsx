import {
  Bar,
  Brush,
  CartesianGrid,
  Line,
  ComposedChart as RechartsComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface ComposedChartProps {
  rowSpan?: number
  data?: unknown
}

type TrendPoint = {
  date: string
  value?: number
  teams?: number
}

export function ComposedChart({ rowSpan = 1, data }: ComposedChartProps) {
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsComposedChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: rowSpan === 2 ? 30 : 0 }}
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
          yAxisId="left"
          stroke={CHART_COLORS.muted}
          tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
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
        <Bar
          yAxisId="left"
          dataKey="value"
          fill={CHART_COLORS.primary}
          name="Incidents"
          radius={[4, 4, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="teams"
          stroke={CHART_COLORS.accent}
          strokeWidth={2}
          dot={false}
          name="Teams"
        />
        {rowSpan === 2 && (
          <Brush dataKey="date" height={25} stroke={CHART_COLORS.muted} />
        )}
      </RechartsComposedChart>
    </ResponsiveContainer>
  )
}
