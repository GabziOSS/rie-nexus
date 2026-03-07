import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface PieChartProps {
  data?: unknown
}

type Incident = {
  severity: string
}

export function PieChart({ data }: PieChartProps) {
  const rawData = data ?? DATA_REGISTRY.incidents
  const incidents = Array.isArray(rawData) ? rawData : []

  const severityCounts = incidents.reduce(
    (acc: Record<string, number>, inc: Incident) => {
      acc[inc.severity] = (acc[inc.severity] || 0) + 1
      return acc
    },
    {}
  )

  const chartData = Object.entries(severityCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  const colors = [
    CHART_COLORS.fire,
    CHART_COLORS.warning,
    CHART_COLORS.primary,
    CHART_COLORS.medical,
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_COLORS.card,
            border: `1px solid ${CHART_COLORS.border}`,
            borderRadius: "8px",
            color: CHART_COLORS.cardForeground,
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
