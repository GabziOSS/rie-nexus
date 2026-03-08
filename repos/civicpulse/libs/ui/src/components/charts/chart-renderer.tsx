/**
 * ChartRenderer
 * Maps ChartBlock type to the correct chart component.
 * Resolves data from @rie-civicpulse/mock-data DATA_REGISTRY.
 * Single source of truth for type → component mapping.
 *
 * All chart components must accept: { block: ChartBlock; data: unknown }
 */

import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import type {
  ChartBlock,
  ChartType,
} from "@rie-civicpulse/ui/lib/dashboard-blocks"
import { StatCardFull } from "@rie-civicpulse/ui/components/stat-card-full"
import { LineChart } from "./line-chart"
import { AreaChart } from "./area-chart"
import { BarChart } from "./bar-chart"
import { ComposedChart } from "./composed-chart"
import { RadarChart } from "./radar-chart"
import { PieChart } from "./pie-chart"
import { RadialBarChart } from "./radial-bar-chart"
import { ScatterChart } from "./scatter-chart"
import { GaugeArcChart } from "./gauge-arc-chart"
import { WindRoseChart } from "./wind-rose-chart"
import { CompassChart } from "./compass-chart"
import { SparkBarChart } from "./spark-bar-chart"
import { TimelineHeatmap } from "./timeline-heatmap"
import { CalendarHeatmap } from "./calendar-heatmap"
import { BulletChart } from "./bullet-chart"

// TODO: Update all chart components to accept { block, data } props
// For now, using any to avoid type conflicts during transition
const CHART_MAP: Record<ChartType, React.ComponentType<any>> = {
  "stat-card": StatCardFull,
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
  const data =
    DATA_REGISTRY[block.dataKey as keyof typeof DATA_REGISTRY] ?? null

  if (!Component) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Unknown type: {block.type}
      </div>
    )
  }

  return <Component block={block} data={data} />
}
