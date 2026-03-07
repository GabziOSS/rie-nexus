import type { Zone } from "../types"
import { GEO_BOUNDS } from "../types"
import { randFloat } from "../seed"

// Calbayog City barangay-inspired zone names with coordinates within bounds
// Bounds: [[124.2, 11.75], [124.95, 12.42]]
export const ZONE_DEFINITIONS = [
  { name: "Poblacion", color: "#ef4444", baseLon: 124.55, baseLat: 12.07 },
  { name: "Buhangin", color: "#f97316", baseLon: 124.6, baseLat: 12.1 },
  { name: "Talomo", color: "#eab308", baseLon: 124.5, baseLat: 12.05 },
  { name: "Matina", color: "#22c55e", baseLon: 124.55, baseLat: 12.0 },
  { name: "Panacan", color: "#14b8a6", baseLon: 124.65, baseLat: 12.1 },
  { name: "Maa", color: "#06b6d4", baseLon: 124.5, baseLat: 12.12 },
  { name: "Toril", color: "#3b82f6", baseLon: 124.45, baseLat: 12.0 },
  { name: "Baguio", color: "#8b5cf6", baseLon: 124.55, baseLat: 12.15 },
  { name: "Calinan", color: "#d946ef", baseLon: 124.4, baseLat: 12.1 },
  { name: "Marilog", color: "#f43f5e", baseLon: 124.35, baseLat: 12.2 },
  { name: "Sirawan", color: "#10b981", baseLon: 124.65, baseLat: 12.05 },
  { name: "Lizada", color: "#f59e0b", baseLon: 124.6, baseLat: 12.15 },
] as const

export function generateZones(): Zone[] {
  return ZONE_DEFINITIONS.map((def, index) => {
    // Add small random offset to centroid within Calbayog bounds
    const lon = def.baseLon + randFloat(-0.08, 0.08)
    const lat = def.baseLat + randFloat(-0.08, 0.08)

    // Clamp to valid bounds
    const clampedLon = Math.max(
      GEO_BOUNDS.minLon,
      Math.min(GEO_BOUNDS.maxLon, lon)
    )
    const clampedLat = Math.max(
      GEO_BOUNDS.minLat,
      Math.min(GEO_BOUNDS.maxLat, lat)
    )

    return {
      id: `zone-${index + 1}`,
      name: def.name,
      color: def.color,
      centroid: [clampedLon, clampedLat] as [number, number],
    }
  })
}
