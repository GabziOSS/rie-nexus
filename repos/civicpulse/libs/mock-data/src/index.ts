// Zone generators
export { generateZones, ZONE_DEFINITIONS } from "./generators/zones.js"
export { generateZonesGeoJSON } from "./generators/zones.geojson.js"

// Incident generators
export { generateIncidents } from "./generators/incidents.js"

// Metric generators
export { generateMetrics } from "./generators/metrics.js"
export { generateTrends } from "./generators/trends.js"

// Other generators
export { generateDistricts } from "./generators/districts.js"
export { generateDirections } from "./generators/direction.js"
export { generateHeatmap } from "./generators/heatmap.js"
export { generateCalendar } from "./generators/calendar.js"
export { generateBulletMetrics } from "./generators/bullet.js"
export { generateUsers } from "./generators/users.js"

// Chart data generators
export {
  generateIncidentsTrend,
  generateIncidentDirection,
  generateIncidentsByType,
  generateDistrictRisk,
  generateResponseTimeTrend,
  generateAlertSeverityDist,
  generateIncidentsVsResources,
  generateRiskVectorBearing,
  generateDensityVsPop,
  generateSeveritySnapshot,
} from "./generators/chart-data.js"

// Types
export type {
  Zone,
  Incident,
  Metric,
  Trend,
  TrendPoint,
  District,
  Direction,
  HeatmapCell,
  CalendarDay,
  BulletMetric,
  User,
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  DataRegistry,
} from "./types.js"

// Pre-generate all data
import { generateZones } from "./generators/zones.js"
import { generateZonesGeoJSON } from "./generators/zones.geojson.js"
import { generateIncidents } from "./generators/incidents.js"
import { generateMetrics } from "./generators/metrics.js"
import { generateTrends } from "./generators/trends.js"
import { generateDistricts } from "./generators/districts.js"
import { generateDirections } from "./generators/direction.js"
import { generateHeatmap } from "./generators/heatmap.js"
import { generateCalendar } from "./generators/calendar.js"
import { generateBulletMetrics } from "./generators/bullet.js"
import { generateUsers } from "./generators/users.js"
import {
  generateIncidentsTrend,
  generateIncidentDirection,
  generateIncidentsByType,
  generateDistrictRisk,
  generateResponseTimeTrend,
  generateAlertSeverityDist,
  generateIncidentsVsResources,
  generateRiskVectorBearing,
  generateDensityVsPop,
  generateSeveritySnapshot,
} from "./generators/chart-data.js"

import type { DataRegistry } from "./types.js"

// Pre-generate all data at module load time
const zones = generateZones()
const incidents = generateIncidents(zones, 500)
const metrics = generateMetrics()
const trends = generateTrends()
const districts = generateDistricts()
const directions = generateDirections()
const heatmap = generateHeatmap()
const calendar = generateCalendar()
const bulletMetrics = generateBulletMetrics()
const users = generateUsers()
const zonesGeoJSON = generateZonesGeoJSON(zones)

// Chart-specific data
const incidentsTrend = generateIncidentsTrend()
const incidentDirection = generateIncidentDirection()
const incidentsByType = generateIncidentsByType()
const districtRisk = generateDistrictRisk()
const responseTimeTrend = generateResponseTimeTrend()
const alertSeverityDist = generateAlertSeverityDist()
const incidentsVsResources = generateIncidentsVsResources()
const riskVectorBearing = generateRiskVectorBearing()
const densityVsPop = generateDensityVsPop()
const severitySnapshot = generateSeveritySnapshot()

export const DATA_REGISTRY: DataRegistry = {
  zones,
  incidents,
  metrics,
  trends,
  districts,
  directions,
  heatmap,
  calendar,
  bulletMetrics,
  users,
  zonesGeoJSON,
  // Chart-specific data
  incidents_total: metrics[0].value,
  alerts_active: metrics[1].value,
  zones_high_risk: metrics[2].value,
  response_time_avg: metrics[3].value,
  incidents_trend: incidentsTrend,
  risk_score_current: metrics[4].value,
  incident_direction: incidentDirection,
  incidents_by_type: incidentsByType,
  district_risk: districtRisk,
  response_time_trend: responseTimeTrend,
  responder_readiness: metrics[5].value,
  incident_heatmap: heatmap,
  alert_severity_dist: alertSeverityDist,
  incidents_vs_resources: incidentsVsResources,
  risk_vector_bearing: riskVectorBearing,
  incidents_calendar: calendar,
  density_vs_pop: densityVsPop,
  response_vs_sla: bulletMetrics,
  severity_snapshot: severitySnapshot,
}

// Convenience exports for common data
export const ZONES = zones
export const INCIDENTS = incidents
export const METRICS = metrics
export const TRENDS = trends
export const DISTRICTS = districts
export const DIRECTIONS = directions
export const HEATMAP = heatmap
export const CALENDAR = calendar
export const BULLET_METRICS = bulletMetrics
export const USERS = users
export const ZONES_GEOJSON = zonesGeoJSON

// Chart data convenience exports
export const INCIDENTS_TREND = incidentsTrend
export const INCIDENT_DIRECTION = incidentDirection
export const INCIDENTS_BY_TYPE = incidentsByType
export const DISTRICT_RISK = districtRisk
export const RESPONSE_TIME_TREND = responseTimeTrend
export const ALERT_SEVERITY_DIST = alertSeverityDist
export const INCIDENTS_VS_RESOURCES = incidentsVsResources
export const RISK_VECTOR_BEARING = riskVectorBearing
export const DENSITY_VS_POP = densityVsPop
export const SEVERITY_SNAPSHOT = severitySnapshot
