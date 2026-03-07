import { randFloat, randInt, randItem } from "../seed.js"

/**
 * Generate incidents trend data: 90 days of incident counts
 */
export function generateIncidentsTrend() {
  const data = []
  const today = new Date()

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.floor(randFloat(10, 60)),
    })
  }

  return data
}

/**
 * Generate incident direction data: 8 cardinal directions with bins
 */
export function generateIncidentDirection() {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

  return directions.map((dir, idx) => ({
    direction: dir,
    degrees: idx * 45,
    bins: [
      Math.floor(randFloat(20, 120)),
      Math.floor(randFloat(10, 90)),
      Math.floor(randFloat(5, 60)),
    ],
  }))
}

/**
 * Generate incidents by type: 6 incident types with counts
 */
export function generateIncidentsByType() {
  const types = [
    "Fire",
    "Flood",
    "Crime",
    "Medical",
    "Infrastructure",
    "Weather",
  ]

  return types.map((type) => ({
    type,
    count: Math.floor(randFloat(50, 350)),
  }))
}

/**
 * Generate district risk profile: 6 districts with 5 risk dimensions
 */
export function generateDistrictRisk() {
  const districts = ["North", "South", "East", "West", "Central", "Coastal"]
  const dimensions = [
    "Safety",
    "Traffic",
    "Health",
    "Infrastructure",
    "Environment",
  ]

  return districts.map((district) => ({
    district,
    ...Object.fromEntries(
      dimensions.map((dim) => [dim, Math.floor(randFloat(20, 100))])
    ),
  }))
}

/**
 * Generate response time trend: 90 days of avg and p90 response times
 */
export function generateResponseTimeTrend() {
  const data = []
  const today = new Date()

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const avgMinutes = Math.floor(randFloat(5, 13))

    data.push({
      date: date.toISOString().split("T")[0],
      avgMinutes,
      p90Minutes: Math.floor(avgMinutes + randFloat(3, 8)),
    })
  }

  return data
}

/**
 * Generate alert severity distribution: 4 severity levels with counts
 */
export function generateAlertSeverityDist() {
  return [
    { severity: "Critical", count: Math.floor(randFloat(5, 20)) },
    { severity: "High", count: Math.floor(randFloat(30, 60)) },
    { severity: "Medium", count: Math.floor(randFloat(70, 120)) },
    { severity: "Low", count: Math.floor(randFloat(100, 200)) },
  ]
}

/**
 * Generate incidents vs resources: 30 days of incidents and deployed resources
 */
export function generateIncidentsVsResources() {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      incidents: Math.floor(randFloat(10, 50)),
      deployed: Math.floor(randFloat(20, 100)),
    })
  }

  return data
}

/**
 * Generate risk vector bearing: compass heading 0-360 degrees
 */
export function generateRiskVectorBearing(): number {
  return Math.floor(randFloat(0, 360))
}

/**
 * Generate density vs population: scatter plot of zones
 */
export function generateDensityVsPop() {
  const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F"]
  const riskLevels = ["low", "medium", "high"] as const

  return zones.map((zone) => ({
    zone,
    population: Math.floor(randFloat(10000, 110000)),
    incidentCount: Math.floor(randFloat(50, 550)),
    riskLevel: randItem(riskLevels),
    area_km2: Math.floor(randFloat(5, 55)),
  }))
}

/**
 * Generate severity snapshot: spark bar chart of severity counts
 */
export function generateSeveritySnapshot() {
  return [
    { severity: "Critical", count: Math.floor(randFloat(5, 20)) },
    { severity: "High", count: Math.floor(randFloat(30, 60)) },
    { severity: "Medium", count: Math.floor(randFloat(70, 120)) },
    { severity: "Low", count: Math.floor(randFloat(100, 200)) },
  ]
}
