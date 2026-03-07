// Geographic bounds for Davao City area
export const GEO_BOUNDS = {
  minLon: 124.2,
  maxLon: 124.95,
  minLat: 11.75,
  maxLat: 12.42,
} as const

export interface Zone {
  id: string
  name: string
  color: string
  centroid: [number, number] // [longitude, latitude]
}

export interface Incident {
  id: string
  zoneId: string
  type: string
  status: "reported" | "investigating" | "resolved" | "closed"
  severity: "low" | "medium" | "high" | "critical"
  reportedAt: string
  resolvedAt: string | null
  description: string
  location: {
    coordinates: [number, number]
    address: string
  }
  assignedTo: string | null
}

export interface Metric {
  id: string
  name: string
  value: number
  unit: string
  change: number // percentage change from previous period
  trend: "up" | "down" | "stable"
}

export interface TrendPoint {
  date: string
  value: number
}

export interface Trend {
  id: string
  metricId: string
  period: "365d" | "90d"
  data: TrendPoint[]
}

export interface District {
  id: string
  name: string
  population: number
  zones: string[]
}

export interface Direction {
  id: string
  name: string
  degrees: number
}

export interface HeatmapCell {
  dayOfWeek: number // 0-6
  hour: number // 0-23
  value: number // normalized 0-1
}

export interface CalendarDay {
  date: string
  dayOfWeek: number
  isWeekend: boolean
  incidents: number
  criticalIncidents: number
}

export interface BulletMetric {
  id: string
  title: string
  response: number // actual response time in minutes
  sla: number // SLA target in minutes
  unit: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "operator" | "analyst" | "viewer"
  avatar: string
  zoneIds: string[]
}

export interface GeoJSONFeature {
  type: "Feature"
  properties: {
    zoneId: string
    name: string
    color: string
  }
  geometry: {
    type: "Polygon"
    coordinates: number[][][]
  }
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection"
  features: GeoJSONFeature[]
}

export interface DataRegistry {
  zones: Zone[]
  incidents: Incident[]
  metrics: Metric[]
  trends: Trend[]
  districts: District[]
  directions: Direction[]
  heatmap: HeatmapCell[]
  calendar: CalendarDay[]
  bulletMetrics: BulletMetric[]
  users: User[]
  zonesGeoJSON: GeoJSONFeatureCollection
  // Chart-specific data
  incidents_total: number
  alerts_active: number
  zones_high_risk: number
  response_time_avg: number
  incidents_trend: TrendPoint[]
  risk_score_current: number
  incident_direction: Array<{
    direction: string
    degrees: number
    bins: number[]
  }>
  incidents_by_type: Array<{
    type: string
    count: number
  }>
  district_risk: Array<{
    district: string
    [key: string]: string | number
  }>
  response_time_trend: Array<{
    date: string
    avgMinutes: number
    p90Minutes: number
  }>
  responder_readiness: number
  incident_heatmap: HeatmapCell[]
  alert_severity_dist: Array<{
    severity: string
    count: number
  }>
  incidents_vs_resources: Array<{
    date: string
    incidents: number
    deployed: number
  }>
  risk_vector_bearing: number
  incidents_calendar: CalendarDay[]
  density_vs_pop: Array<{
    zone: string
    population: number
    incidentCount: number
    riskLevel: string
    area_km2: number
  }>
  response_vs_sla: BulletMetric[]
  severity_snapshot: Array<{
    severity: string
    count: number
  }>
}
