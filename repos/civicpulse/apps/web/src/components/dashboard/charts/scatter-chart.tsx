import {
  CartesianGrid,
  ScatterChart as RechartsScatterChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"
import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface ScatterChartProps {
  data?: unknown
}

interface ZoneData {
  name: string
  population: number
  incidents: number
  risk: number
  fill: string
}

export function ScatterChart({ data }: ScatterChartProps) {
  const zones = data ?? DATA_REGISTRY.zones
  const districts = DATA_REGISTRY.districts
  const incidents = DATA_REGISTRY.incidents

  const chartData: Array<ZoneData> = (
    zones as Array<{ id: string; name: string; population?: number }>
  ).map(
    (
      zone: { id: string; name: string; population?: number },
      index: number
    ) => {
      const zoneIncidents = incidents.filter(
        (i: { zoneId: string }) => i.zoneId === zone.id
      ).length
      const district = districts[index % districts.length]
      const risk =
        zoneIncidents > 0
          ? (zoneIncidents / (district.population || 1000)) * 1000
          : 0

      return {
        name: zone.name,
        population: zone.population || Math.random() * 10000,
        incidents: zoneIncidents,
        risk: Math.min(100, risk * 10),
        fill:
          risk > 70
            ? CHART_COLORS.fire
            : risk > 40
              ? CHART_COLORS.warning
              : CHART_COLORS.medical,
      }
    }
  )

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
        <XAxis
          type="number"
          dataKey="population"
          name="Population"
          stroke={CHART_COLORS.muted}
          tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="number"
          dataKey="incidents"
          name="Incidents"
          stroke={CHART_COLORS.muted}
          tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
        />
        <ZAxis type="number" dataKey="risk" range={[50, 200]} />
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_COLORS.card,
            border: `1px solid ${CHART_COLORS.border}`,
            borderRadius: "8px",
            color: CHART_COLORS.cardForeground,
          }}
          cursor={{ strokeDasharray: "3 3" }}
        />
        <Scatter name="Zones" data={chartData}>
          {chartData.map((entry: ZoneData, index: number) => (
            <Scatter key={`scatter-${index}`} fill={entry.fill} />
          ))}
        </Scatter>
      </RechartsScatterChart>
    </ResponsiveContainer>
  )
}
