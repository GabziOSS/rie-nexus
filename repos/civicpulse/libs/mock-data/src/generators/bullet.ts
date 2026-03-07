import type { BulletMetric } from "../types"
import { randInt } from "../seed"

/**
 * Generate bullet metrics (response time vs SLA)
 */
export function generateBulletMetrics(): BulletMetric[] {
  return [
    {
      id: "bullet-critical",
      title: "Critical Incidents",
      response: randInt(8, 25),
      sla: 15,
      unit: "min",
    },
    {
      id: "bullet-high",
      title: "High Priority",
      response: randInt(20, 55),
      sla: 45,
      unit: "min",
    },
    {
      id: "bullet-medium",
      title: "Medium Priority",
      response: randInt(60, 180),
      sla: 120,
      unit: "min",
    },
    {
      id: "bullet-low",
      title: "Low Priority",
      response: randInt(180, 480),
      sla: 360,
      unit: "min",
    },
    {
      id: "bullet-overall",
      title: "Overall Response",
      response: randInt(25, 75),
      sla: 60,
      unit: "min",
    },
  ]
}
