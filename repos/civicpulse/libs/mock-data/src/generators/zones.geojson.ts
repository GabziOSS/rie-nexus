import type { GeoJSONFeatureCollection, Zone } from "../types"
import { GEO_BOUNDS } from "../types"
import { randFloat } from "../seed"

/**
 * Generate GeoJSON polygon for a zone
 * Creates a closed ring (first point == last point)
 */
function generateZonePolygon(zone: Zone): number[][][] {
  const [centerLon, centerLat] = zone.centroid

  // Generate polygon vertices around centroid
  const numVertices = 6 + Math.floor(randFloat(0, 3)) // 6-8 vertices
  const baseRadius = 0.04 + randFloat(-0.01, 0.01)

  const vertices: [number, number][] = []

  for (let i = 0; i < numVertices; i++) {
    const angle = (2 * Math.PI * i) / numVertices + randFloat(-0.2, 0.2)
    const radius = baseRadius * (0.8 + randFloat(0, 0.4))

    let lon = centerLon + radius * Math.cos(angle)
    let lat = centerLat + radius * Math.sin(angle)

    // Clamp to valid bounds
    lon = Math.max(GEO_BOUNDS.minLon, Math.min(GEO_BOUNDS.maxLon, lon))
    lat = Math.max(GEO_BOUNDS.minLat, Math.min(GEO_BOUNDS.maxLat, lat))

    vertices.push([lon, lat])
  }

  // Close the ring (first point == last point)
  vertices.push(vertices[0])

  return [vertices]
}

/**
 * Generate GeoJSON FeatureCollection for all zones
 */
export function generateZonesGeoJSON(zones: Zone[]): GeoJSONFeatureCollection {
  const features = zones.map((zone) => ({
    type: "Feature" as const,
    properties: {
      zoneId: zone.id,
      name: zone.name,
      color: zone.color,
    },
    geometry: {
      type: "Polygon" as const,
      coordinates: generateZonePolygon(zone),
    },
  }))

  return {
    type: "FeatureCollection",
    features,
  }
}
