import type { Direction } from "../types.js"

/**
 * Generate 8 cardinal and intercardinal directions
 */
export function generateDirections(): Direction[] {
  return [
    { id: "direction-n", name: "North", degrees: 0 },
    { id: "direction-ne", name: "Northeast", degrees: 45 },
    { id: "direction-e", name: "East", degrees: 90 },
    { id: "direction-se", name: "Southeast", degrees: 135 },
    { id: "direction-s", name: "South", degrees: 180 },
    { id: "direction-sw", name: "Southwest", degrees: 225 },
    { id: "direction-w", name: "West", degrees: 270 },
    { id: "direction-nw", name: "Northwest", degrees: 315 },
  ]
}
