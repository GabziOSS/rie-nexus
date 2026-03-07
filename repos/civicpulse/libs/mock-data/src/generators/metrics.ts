import type { Metric } from "../types"
import { randFloat, randItem } from "../seed"

/**
 * Generate KPI metrics including all dashboard indicators
 */
export function generateMetrics(): Metric[] {
  return [
    {
      id: "incidents_total",
      name: "Total Incidents",
      value: Math.floor(randFloat(1000, 1500)),
      unit: "incidents",
      change: randFloat(-20, 30),
      trend: randItem(["up", "down", "stable"]),
    },
    {
      id: "alerts_active",
      name: "Active Alerts",
      value: Math.floor(randFloat(10, 50)),
      unit: "alerts",
      change: randFloat(-15, 20),
      trend: randItem(["up", "down", "stable"]),
    },
    {
      id: "zones_high_risk",
      name: "High-Risk Zones",
      value: Math.floor(randFloat(3, 10)),
      unit: "zones",
      change: randFloat(-10, 15),
      trend: randItem(["up", "down", "stable"]),
    },
    {
      id: "response_time_avg",
      name: "Avg Response Time",
      value: Math.floor(randFloat(5, 15) * 10) / 10,
      unit: "minutes",
      change: randFloat(-20, 10),
      trend: randItem(["up", "down", "stable"]),
    },
    {
      id: "risk_score_current",
      name: "Current Risk Score",
      value: Math.floor(randFloat(40, 85)),
      unit: "score",
      change: randFloat(-15, 25),
      trend: randItem(["up", "down", "stable"]),
    },
    {
      id: "responder_readiness",
      name: "Responder Readiness",
      value: Math.floor(randFloat(75, 98)),
      unit: "%",
      change: randFloat(-10, 15),
      trend: randItem(["up", "down", "stable"]),
    },
  ]
}
