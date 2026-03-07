import type { District } from "../types.js"

/**
 * Generate 6 districts
 */
export function generateDistricts(): District[] {
  return [
    {
      id: "district-1",
      name: "Central District",
      population: 185000,
      zones: ["zone-1", "zone-2", "zone-3"],
    },
    {
      id: "district-2",
      name: "Northern District",
      population: 142000,
      zones: ["zone-4", "zone-5", "zone-6"],
    },
    {
      id: "district-3",
      name: "Southern District",
      population: 128000,
      zones: ["zone-7", "zone-8", "zone-9"],
    },
    {
      id: "district-4",
      name: "Eastern District",
      population: 98000,
      zones: ["zone-10", "zone-11"],
    },
    {
      id: "district-5",
      name: "Western District",
      population: 76000,
      zones: ["zone-12"],
    },
    {
      id: "district-6",
      name: "Mountain District",
      population: 45000,
      zones: [],
    },
  ]
}
