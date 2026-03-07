import type { HeatmapCell } from "../types"
import { seed } from "../seed"

/**
 * Generate heatmap data: 7 days x 24 hours
 */
export function generateHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = []

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    for (let hour = 0; hour < 24; hour++) {
      // Base probability varies by day and hour
      let baseValue = 0.3

      // Weekends have different patterns
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend: higher during day, lower at night
        if (hour >= 9 && hour <= 21) {
          baseValue = 0.5
        } else {
          baseValue = 0.2
        }
      } else {
        // Weekday: higher during commute hours
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
          baseValue = 0.8
        } else if (hour >= 9 && hour <= 17) {
          baseValue = 0.6
        } else {
          baseValue = 0.3
        }
      }

      // Add some noise
      const value = Math.max(
        0,
        Math.min(1, baseValue + seed.float(-0.15, 0.15))
      )

      cells.push({
        dayOfWeek,
        hour,
        value: Math.round(value * 100) / 100,
      })
    }
  }

  return cells
}
