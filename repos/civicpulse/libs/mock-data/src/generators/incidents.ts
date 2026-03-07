import type { Incident, Zone } from "../types.js"
import {
  randItem,
  randWeighted,
  randInt,
  randDate,
  randId,
  seed,
} from "../seed.js"

const INCIDENT_TYPES = [
  "traffic_accident",
  "infrastructure_damage",
  "public_disturbance",
  "medical_emergency",
  "fire_incident",
  "flooding",
  "power_outage",
  "water_outage",
  "road_blockage",
  "noise_complaint",
  "illegal_dumping",
  "street_light_out",
] as const

const STATUSES = ["reported", "investigating", "resolved", "closed"] as const
const STATUS_WEIGHTS = [0.15, 0.25, 0.35, 0.25]

const SEVERITIES = ["low", "medium", "high", "critical"] as const
const SEVERITY_WEIGHTS = [0.4, 0.35, 0.2, 0.05]

function generateIncidentDescription(type: string): string {
  const templates: Record<string, string[]> = {
    traffic_accident: [
      "Vehicle collision at intersection",
      "Motorcycle crash reported",
      "Hit and run incident",
      "Multi-vehicle pile-up",
    ],
    infrastructure_damage: [
      "Broken water main",
      "Damaged road surface",
      "Fallen power pole",
      "Collapsed drainage",
    ],
    public_disturbance: [
      "Large gathering causing noise",
      "Verbal altercation reported",
      "Suspicious activity",
      "Crowd control needed",
    ],
    medical_emergency: [
      "Person requiring medical attention",
      "Heart attack reported",
      "Injury at public place",
      "Breathing difficulty",
    ],
    fire_incident: [
      "Structure fire",
      "Vehicle fire",
      "Grass fire",
      "Electrical fire",
    ],
    flooding: [
      "Flash flood in area",
      "Road flooding",
      "Basement flooding",
      "Drainage overflow",
    ],
    power_outage: [
      "Unexpected power loss",
      "Transformer failure",
      " downed power line",
      "Scheduled outage",
    ],
    water_outage: [
      "Water supply interrupted",
      "Leaking main pipe",
      "Low water pressure",
      "Contaminated water",
    ],
    road_blockage: [
      "Fallen tree blocking road",
      "Construction zone",
      "Vehicle breakdown",
      "Debris on roadway",
    ],
    noise_complaint: [
      "Loud music complaint",
      "Construction noise",
      "Bar/club noise",
      "Neighbour dispute",
    ],
    illegal_dumping: [
      "Waste dumped in empty lot",
      "Hazardous materials dumped",
      "Construction debris",
      "Household waste",
    ],
    street_light_out: [
      "Multiple lights not working",
      "Light knocked down",
      "Electrical issue",
      "Maintenance needed",
    ],
  }

  const typeTemplates = templates[type] || ["Incident reported"]
  return randItem(typeTemplates)
}

/**
 * Generate 500 incidents with seasonal patterns
 */
export function generateIncidents(
  zones: Zone[],
  count: number = 500
): Incident[] {
  const incidents: Incident[] = []
  const now = new Date()
  const oneYearAgo = new Date(now)
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  for (let i = 0; i < count; i++) {
    // Random date within past year
    const randomDate = randDate(oneYearAgo, now)
    const date = new Date(randomDate)

    const zone = randItem(zones)
    const type = randItem(INCIDENT_TYPES)
    const severity = randWeighted(SEVERITIES, SEVERITY_WEIGHTS)
    const status = randWeighted(STATUSES, STATUS_WEIGHTS)

    // Calculate resolution time based on severity (in hours)
    let resolutionHours: number
    switch (severity) {
      case "critical":
        resolutionHours = randInt(1, 4)
        break
      case "high":
        resolutionHours = randInt(4, 12)
        break
      case "medium":
        resolutionHours = randInt(12, 48)
        break
      default:
        resolutionHours = randInt(24, 168) // 1-7 days
    }

    const reportedAt = randomDate
    const resolvedAt =
      status === "reported"
        ? null
        : new Date(
            date.getTime() + resolutionHours * 60 * 60 * 1000
          ).toISOString()

    // Location within zone
    const [baseLon, baseLat] = zone.centroid
    const lon = baseLon + seed.float(-0.03, 0.03)
    const lat = baseLat + seed.float(-0.03, 0.03)

    // Generate address
    const streetNames = [
      "Mabini St",
      "San Pedro Ave",
      "CM Recto Ave",
      "Ponce St",
      "Espinosa St",
      "C.M. Recto",
      "Laperal St",
      "Torres St",
    ]
    const streetNumber = randInt(1, 500)

    incidents.push({
      id: `inc-${randId()}`,
      zoneId: zone.id,
      type,
      status,
      severity,
      reportedAt,
      resolvedAt,
      description: generateIncidentDescription(type),
      location: {
        coordinates: [lon, lat],
        address: `${streetNumber} ${randItem(streetNames)}, ${zone.name}`,
      },
      assignedTo: status === "reported" ? null : `user-${randInt(1, 12)}`,
    })
  }

  return incidents
}
