import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { StatCardFull } from "@rie-civicpulse/ui/components/stat-card-full"

import { AreaChart } from "./charts/area-chart"
import { BarChart } from "./charts/bar-chart"
import { BulletChart } from "./charts/bullet-chart"
import { CalendarHeatmap } from "./charts/calendar-heatmap"
import { CompassChart } from "./charts/compass-chart"
import { ComposedChart } from "./charts/composed-chart"
import { GaugeArcChart } from "./charts/gauge-arc-chart"
import { LineChart } from "./charts/line-chart"
import { PieChart } from "./charts/pie-chart"
import { RadarChart } from "./charts/radar-chart"
import { RadialBarChart } from "./charts/radial-bar-chart"
import { ScatterChart } from "./charts/scatter-chart"
import { SparkBarChart } from "./charts/spark-bar-chart"
import { TimelineHeatmap } from "./charts/timeline-heatmap"
import { WindRoseChart } from "./charts/wind-rose-chart"
import type { ChartBlock, ChartType } from "@/lib/dashboard-blocks"

function StatCardWrapper({
  block,
  data,
}: {
  block: ChartBlock
  data: unknown
}) {
  const metrics = Array.isArray(data) ? data[0] : data
  const metric = metrics && typeof metrics === "object" ? metrics : {}

  return (
    <StatCardFull
      title={block.title}
      subtitle={block.subtitle}
      value={
        typeof metric === "object" && metric !== null && "value" in metric
          ? (metric as { value: number }).value
          : 0
      }
      unit={block.unit}
    />
  )
}

const CHART_MAP: Record<
  ChartType,
  React.ComponentType<{ block: ChartBlock; data: unknown }>
> = {
  "stat-card": StatCardWrapper,
  line: LineChart,
  area: AreaChart,
  bar: BarChart,
  composed: ComposedChart,
  radar: RadarChart,
  pie: PieChart,
  radial: RadialBarChart,
  scatter: ScatterChart,
  "gauge-arc": GaugeArcChart,
  "wind-rose": WindRoseChart,
  compass: CompassChart,
  "spark-bar": SparkBarChart,
  "timeline-heatmap": TimelineHeatmap,
  "calendar-heat": CalendarHeatmap,
  bullet: BulletChart,
}

export function ChartRenderer({ block }: { block: ChartBlock }) {
  const Component = CHART_MAP[block.type]
  const data = DATA_REGISTRY[block.dataKey as keyof typeof DATA_REGISTRY]

  return <Component block={block} data={data} />
}
