"use client"

/**
 * BulletChart
 * Horizontal bar comparing actual vs target with qualitative ranges.
 * Three background bands: poor / acceptable / good.
 * Actual bar fills to actual/max %.
 * Target marker as vertical rule at target/max %.
 * Labels below: actual, target, unit.
 */

import { memo, useMemo } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export interface BulletChartProps {
  /** Current value */
  actual?: number
  /** Target value */
  target?: number
  /** Ranges as [poor, acceptable, good] thresholds from max to min */
  ranges?: [number, number, number]
  /** Unit label (e.g., "min", "cases") */
  unit?: string
  /** Chart title */
  title?: string
  className?: string
}

function BulletChartComponent({
  actual,
  target,
  ranges = [100, 50, 30],
  unit = "",
  title,
  className,
}: BulletChartProps) {
  // Loading state
  if (actual === undefined || target === undefined) {
    return (
      <div
        className={cn(
          "h-full w-full animate-pulse rounded-lg bg-muted/30",
          className
        )}
      />
    )
  }

  // Calculate percentages
  const maxRange = ranges[0]
  const { poorPct, acceptablePct, goodPct, actualPct, targetPct } = useMemo(
    () => ({
      poorPct: 100, // Full width
      acceptablePct: (ranges[1] / maxRange) * 100,
      goodPct: (ranges[2] / maxRange) * 100,
      actualPct: Math.min((actual / maxRange) * 100, 100),
      targetPct: Math.min((target / maxRange) * 100, 100),
    }),
    [actual, target, ranges, maxRange]
  )

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {title && (
        <span className="text-xs font-medium text-foreground">{title}</span>
      )}

      {/* Bullet bar */}
      <div className="relative h-8 overflow-hidden rounded">
        {/* Poor band (full width background) */}
        <div className="absolute inset-0 bg-destructive/20" />

        {/* Acceptable band */}
        <div
          className="absolute inset-0 bg-warning/20"
          style={{ width: `${acceptablePct}%` }}
        />

        {/* Good band */}
        <div
          className="absolute inset-0 bg-success/20"
          style={{ width: `${goodPct}%` }}
        />

        {/* Actual value bar */}
        <div
          className="absolute bottom-1 top-1 rounded bg-primary"
          style={{ width: `${actualPct}%` }}
        />

        {/* Target marker */}
        <div
          className="absolute bottom-0 top-0 w-0.5 bg-accent"
          style={{ left: `${targetPct}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">
            {actual}
          </span>
          {unit && <span className="ml-0.5">{unit}</span>}
          <span className="ml-1 text-muted-foreground/70">actual</span>
        </span>
        <span className="text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">
            {target}
          </span>
          {unit && <span className="ml-0.5">{unit}</span>}
          <span className="ml-1 text-muted-foreground/70">target</span>
        </span>
      </div>
    </div>
  )
}

BulletChartComponent.displayName = "BulletChart"

export const BulletChart = memo(BulletChartComponent)
export default BulletChart
