import {
  Bar,
  CartesianGrid,
  Cell,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface BarChartProps {
  colSpan?: number
  data?: unknown
}

export function BarChart({ colSpan = 1, data }: BarChartProps) {
  const rawData = data ?? DATA_REGISTRY.incidents
  const incidents = Array.isArray(rawData) ? rawData : []

  const zoneData = DATA_REGISTRY.zones.map((zone) => {
    const zoneIncidents = incidents.filter(
      (i: { zoneId: string }) => i.zoneId === zone.id
    )
    return {
      name: zone.name.replace("Zone ", "Z"),
      count: zoneIncidents.length,
      zoneId: zone.id,
    }
  })

  const colors = [
    CHART_COLORS.chart[1],
    CHART_COLORS.chart[2],
    CHART_COLORS.chart[3],
    CHART_COLORS.chart[4],
    CHART_COLORS.chart[5],
    CHART_COLORS.chart[6],
  ]

  const layout = colSpan >= 2 ? "horizontal" : "vertical"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={zoneData}
        layout={layout}
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
        {layout === "vertical" ? (
          <>
            <XAxis
              type="number"
              stroke={CHART_COLORS.muted}
              tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke={CHART_COLORS.muted}
              tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
              width={40}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="name"
              stroke={CHART_COLORS.muted}
              tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            />
            <YAxis
              stroke={CHART_COLORS.muted}
              tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_COLORS.card,
            border: `1px solid ${CHART_COLORS.border}`,
            borderRadius: "8px",
            color: CHART_COLORS.cardForeground,
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Incidents">
          {zoneData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
