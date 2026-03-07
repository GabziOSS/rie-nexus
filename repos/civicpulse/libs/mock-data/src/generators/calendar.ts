import type { CalendarDay } from "../types"
import { seed } from "../seed"

/**
 * Generate 365 days of calendar data
 */
export function generateCalendar(): CalendarDay[] {
  const days: CalendarDay[] = []
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - 365)

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Base incidents varies by season
    const month = date.getMonth()
    let seasonalFactor = 1.0
    if (month >= 7 && month <= 10) {
      seasonalFactor = 1.5 // Typhoon season
    } else if (month >= 2 && month <= 4) {
      seasonalFactor = 1.2 // Dry season
    }

    // Weekends have fewer incidents
    const dayFactor = isWeekend ? 0.7 : 1.0

    // Random variation
    const incidents = Math.max(
      0,
      Math.round(seed.float(5, 15) * seasonalFactor * dayFactor)
    )

    const criticalIncidents = Math.max(
      0,
      Math.round(incidents * seed.float(0.05, 0.15))
    )

    days.push({
      date: date.toISOString().split("T")[0],
      dayOfWeek,
      isWeekend,
      incidents,
      criticalIncidents,
    })
  }

  return days
}
