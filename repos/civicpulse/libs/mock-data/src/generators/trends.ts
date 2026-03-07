import type { Trend, TrendPoint } from "../types"
import { seed } from "../seed"

/**
 * Generate trend data points
 */
function generateTrendData(
  days: number,
  baseValue: number,
  volatility: number
): TrendPoint[] {
  const data: TrendPoint[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Add some seasonality and trend
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    const seasonalFactor =
      Math.sin((dayOfYear / 365) * 2 * Math.PI) * (volatility * 0.3)
    const trendFactor = (days - i) * 0.01 // Slight upward trend
    const noise = seed.float(-volatility, volatility)

    const value = Math.max(
      0,
      Math.round(baseValue + seasonalFactor + trendFactor + noise)
    )

    data.push({
      date: date.toISOString().split("T")[0],
      value,
    })
  }

  return data
}

/**
 * Generate 365-day and 90-day trends
 */
export function generateTrends(): Trend[] {
  return [
    {
      id: "trend-active-incidents-365d",
      metricId: "metric-active-incidents",
      period: "365d",
      data: generateTrendData(365, 25, 15),
    },
    {
      id: "trend-active-incidents-90d",
      metricId: "metric-active-incidents",
      period: "90d",
      data: generateTrendData(90, 28, 12),
    },
    {
      id: "trend-response-time-365d",
      metricId: "metric-response-time",
      period: "365d",
      data: generateTrendData(365, 32, 10),
    },
    {
      id: "trend-response-time-90d",
      metricId: "metric-response-time",
      period: "90d",
      data: generateTrendData(90, 30, 8),
    },
    {
      id: "trend-resolution-rate-365d",
      metricId: "metric-resolution-rate",
      period: "365d",
      data: generateTrendData(365, 85, 8),
    },
    {
      id: "trend-resolution-rate-90d",
      metricId: "metric-resolution-rate",
      period: "90d",
      data: generateTrendData(90, 88, 5),
    },
    {
      id: "trend-satisfaction-365d",
      metricId: "metric-customer-satisfaction",
      period: "365d",
      data: generateTrendData(365, 4.2, 0.5),
    },
    {
      id: "trend-satisfaction-90d",
      metricId: "metric-customer-satisfaction",
      period: "90d",
      data: generateTrendData(90, 4.3, 0.3),
    },
  ]
}
