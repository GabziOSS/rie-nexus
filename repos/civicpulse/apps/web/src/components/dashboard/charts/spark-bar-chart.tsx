import {
  Bar,
  Cell,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
} from "recharts"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface SparkBarChartProps {
  data?: unknown
}

export function SparkBarChart({ data }: SparkBarChartProps) {
  const rawData = data ?? DATA_REGISTRY.incidents
  const incidents = Array.isArray(rawData) ? rawData : []

  const severityLevels = ["critical", "high", "medium", "low"]
  const colors = [
    CHART_COLORS.fire,
    CHART_COLORS.warning,
    CHART_COLORS.primary,
    CHART_COLORS.muted,
  ]

  const chartData = severityLevels.map((severity) => ({
    severity,
    count: incidents.filter(
      (incident: { severity: string }) => incident.severity === severity
    ).length,
  }))

  return (
    <ResponsiveContainer width="100%" height={120}>
      <RechartsBarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
