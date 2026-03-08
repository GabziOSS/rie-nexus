/**
 * Default block configurations for Overview and Station View presets.
 * IDs are assigned by the reducer — these are Omit<ChartBlock, "id">.
 */

import type { ChartBlock } from "./dashboard-blocks"

/** Overview — general dashboard preset */
export const OVERVIEW_BLOCKS: Omit<ChartBlock, "id">[] = [
  // Row 1 — KPI stat cards (4 × colSpan 1)
  {
    type: "stat-card",
    title: "Total Incidents",
    dataKey: "incidents_total",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "stat-card",
    title: "Active Alerts",
    dataKey: "alerts_active",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "stat-card",
    title: "High-Risk Zones",
    dataKey: "zones_high_risk",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "stat-card",
    title: "Avg Response",
    dataKey: "response_time_avg",
    colSpan: 1,
    rowSpan: 1,
    unit: "min",
  },

  // Row 2
  {
    type: "line",
    title: "Incident Trend",
    subtitle: "Last 30 days by type",
    dataKey: "incidents_trend",
    colSpan: 2,
    rowSpan: 1,
  },
  {
    type: "gauge-arc",
    title: "City Risk Score",
    subtitle: "Composite index",
    dataKey: "risk_score_current",
    colSpan: 1,
    rowSpan: 1,
    thresholds: { low: 25, mid: 60, high: 85, max: 100 },
  },

  // Row 3
  {
    type: "wind-rose",
    title: "Incident Origin",
    subtitle: "By direction",
    dataKey: "incident_direction",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "bar",
    title: "By Category",
    subtitle: "Last 30 days",
    dataKey: "incidents_by_type",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "radar",
    title: "District Risk",
    subtitle: "5-dimension index",
    dataKey: "district_risk",
    colSpan: 1,
    rowSpan: 1,
  },

  // Row 4
  {
    type: "area",
    title: "Response Time",
    subtitle: "Avg + P90",
    dataKey: "response_time_trend",
    colSpan: 2,
    rowSpan: 1,
  },
  {
    type: "gauge-arc",
    title: "Readiness",
    subtitle: "Responder capacity",
    dataKey: "responder_readiness",
    colSpan: 1,
    rowSpan: 1,
    thresholds: { low: 40, mid: 70, high: 90, max: 100 },
  },

  // Row 5
  {
    type: "timeline-heatmap",
    title: "Heat Matrix",
    subtitle: "30 days × category",
    dataKey: "incident_heatmap",
    colSpan: 2,
    rowSpan: 1,
  },
  {
    type: "radial",
    title: "Resolution Rate",
    subtitle: "% resolved",
    dataKey: "resolution_rate",
    colSpan: 1,
    rowSpan: 1,
  },

  // Row 6
  {
    type: "composed",
    title: "Incidents vs Deployed",
    subtitle: "Dual axis",
    dataKey: "incidents_vs_resources",
    colSpan: 2,
    rowSpan: 1,
  },
  {
    type: "compass",
    title: "Risk Vector",
    subtitle: "Dominant bearing",
    dataKey: "risk_vector_bearing",
    colSpan: 1,
    rowSpan: 1,
  },

  // Row 7 — full width
  {
    type: "calendar-heat",
    title: "Annual Volume",
    subtitle: "Daily incident totals",
    dataKey: "incidents_calendar",
    colSpan: 3,
    rowSpan: 1,
  },

  // Row 8
  {
    type: "scatter",
    title: "Density vs Population",
    subtitle: "By zone",
    dataKey: "density_vs_pop",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "bullet",
    title: "Response vs SLA",
    subtitle: "Last 30 days",
    dataKey: "response_vs_sla",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "spark-bar",
    title: "Severity Snapshot",
    subtitle: "Current period",
    dataKey: "severity_snapshot",
    colSpan: 1,
    rowSpan: 1,
  },
]

/**
 * Station View — WeatherLink-matched preset.
 * Same chart components, different initial configuration.
 * Draggable and resizable — starts here, drifts over time.
 */
export const STATION_BLOCKS: Omit<ChartBlock, "id">[] = [
  // Row 1 — 3 gauges
  {
    type: "gauge-arc",
    title: "Wind Speed",
    subtitle: "km/h",
    dataKey: "wind_speed",
    colSpan: 1,
    rowSpan: 1,
    thresholds: { low: 20, mid: 35, high: 45, max: 60 },
  },
  {
    type: "gauge-arc",
    title: "THW Index",
    subtitle: "Feels like °C",
    dataKey: "thw_index",
    colSpan: 1,
    rowSpan: 1,
    thresholds: { low: 28, mid: 35, high: 40, max: 50 },
  },
  {
    type: "gauge-arc",
    title: "Humidity",
    subtitle: "Relative %",
    dataKey: "humidity",
    colSpan: 1,
    rowSpan: 1,
    thresholds: { low: 60, mid: 80, high: 90, max: 100 },
  },

  // Row 2
  {
    type: "wind-rose",
    title: "Wind Rose",
    subtitle: "Direction distribution",
    dataKey: "wind_rose",
    colSpan: 1,
    rowSpan: 2,
  },
  {
    type: "compass",
    title: "Wind Direction",
    subtitle: "Current bearing",
    dataKey: "wind_bearing",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "spark-bar",
    title: "Temperature",
    subtitle: "Outside · Heat Index · Wet Bulb",
    dataKey: "temperature_group",
    colSpan: 1,
    rowSpan: 1,
  },

  // Row 3 (wind-rose still spanning)
  {
    type: "line",
    title: "Barometer",
    subtitle: "hPa trend",
    dataKey: "barometer_trend",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "bullet",
    title: "Total Rain",
    subtitle: "Month vs annual",
    dataKey: "rain_total",
    colSpan: 1,
    rowSpan: 1,
  },

  // Row 4 — stat cards
  {
    type: "stat-card",
    title: "Current Rain",
    subtitle: "mm/hr",
    dataKey: "rain_current",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "stat-card",
    title: "Sunrise/Sunset",
    subtitle: "Calbayog City",
    dataKey: "sun_times",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "stat-card",
    title: "Moon Phase",
    subtitle: "Current phase",
    dataKey: "moon_phase",
    colSpan: 1,
    rowSpan: 1,
  },

  // Row 5
  {
    type: "bar",
    title: "Inside Temp/Hum",
    subtitle: "Indoor readings",
    dataKey: "indoor_readings",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    type: "stat-card",
    title: "Local Forecast",
    subtitle: "Calbayog, Samar",
    dataKey: "local_forecast",
    colSpan: 2,
    rowSpan: 1,
  },
]
