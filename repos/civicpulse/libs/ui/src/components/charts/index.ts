/**
 * Chart Components Index
 * All Layer 3 chart components for dashboard visualizations.
 * Each chart wraps Recharts or custom SVG with consistent theming.
 */

// Recharts-based charts
export { LineChart, type TrendPoint, type LineChartProps } from "./line-chart"
export {
  AreaChart,
  type ResponseTimePoint,
  type AreaChartProps,
} from "./area-chart"
export { BarChart, type BarDataPoint, type BarChartProps } from "./bar-chart"
export {
  ComposedChart,
  type ComposedDataPoint,
  type ComposedChartProps,
} from "./composed-chart"
export {
  RadarChart,
  type RadarDataPoint,
  type RadarChartProps,
} from "./radar-chart"
export { PieChart, type PieDataPoint, type PieChartProps } from "./pie-chart"
export {
  RadialBarChart,
  type RadialBarChartProps,
} from "./radial-bar-chart"
export {
  ScatterChart,
  type ScatterDataPoint,
  type ScatterChartProps,
  type RiskLevel,
} from "./scatter-chart"
export {
  SparkBarChart,
  type SparkBarDataPoint,
  type SparkBarChartProps,
} from "./spark-bar-chart"
export { BulletChart, type BulletChartProps } from "./bullet-chart"

// Custom SVG charts
export { GaugeArcChart, type GaugeArcChartProps } from "./gauge-arc-chart"
export {
  WindRoseChart,
  type TimeRange,
  type WindRoseBin,
  type WindRoseDataPoint,
  type WindRoseChartProps,
} from "./wind-rose-chart"
export { CompassChart, type CompassChartProps } from "./compass-chart"
export {
  TimelineHeatmap,
  type IncidentCategory,
  type TimelineHeatmapCell,
  type TimelineHeatmapProps,
} from "./timeline-heatmap"
export {
  CalendarHeatmap,
  type CalendarHeatmapDay,
  type CalendarHeatmapProps,
} from "./calendar-heatmap"
