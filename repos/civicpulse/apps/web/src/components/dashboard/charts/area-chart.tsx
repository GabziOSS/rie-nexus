import {
  Area,
  CartesianGrid,
  AreaChart as RechartsAreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface AreaChartProps {
  data?: unknown
}

type TrendPoint = {
  avg?: number
  date: string
  p90?: number
}

export function AreaChart({ data }: AreaChartProps) {
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
      <RechartsAreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={CHART_COLORS.primary}
              stopOpacity={0.4}
            />
            <stop
              offset="95%"
              stopColor={CHART_COLORS.primary}
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="p90Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={CHART_COLORS.accent}
              stopOpacity={0.4}
            />
            <stop
              offset="95%"
              stopColor={CHART_COLORS.accent}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
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
        <ReferenceLine
          y={30}
          stroke={CHART_COLORS.warning}
          strokeDasharray="5 5"
          label={{ value: "SLA", fontSize: 10, fill: CHART_COLORS.warning }}
        />
        <Area
          type="monotone"
          dataKey="avg"
          stroke={CHART_COLORS.primary}
          fill="url(#avgGradient)"
          strokeWidth={2}
          name="Average"
        />
        <Area
          type="monotone"
          dataKey="p90"
          stroke={CHART_COLORS.accent}
          fill="url(#p90Gradient)"
          strokeWidth={2}
          name="P90"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}
