"use client"

/**
 * StatCardFull — KPI metric card for dashboard hero row.
 * Shows title, value with animated count-up, delta badge, and sparkline.
 * Wrapped in React.memo for performance.
 */

import { memo, useEffect, useRef, useState, useMemo, type ReactNode } from "react"
import { TrendUp, TrendDown } from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export interface StatCardFullProps {
  title: string
  subtitle?: string
  value: number | string
  unit?: string
  /** Positive = up, negative = down */
  delta?: number
  deltaLabel?: string
  /** 7 values for mini bar sparkline */
  sparkData?: number[]
  icon?: ReactNode
  /** Whether up is good (incidents: false, readiness: true) */
  positiveIsGood?: boolean
}

/**
 * Delta badge sub-component.
 */
const DeltaBadge = memo(function DeltaBadge({
  delta,
  deltaLabel,
  isGood,
}: {
  delta: number
  deltaLabel: string
  isGood: boolean
}) {
  const isPositive = delta > 0

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          isGood
            ? "bg-green-500/15 text-green-400"
            : "bg-destructive/15 text-destructive"
        )}
      >
        {isPositive ? (
          <TrendUp size={12} weight="bold" aria-hidden="true" />
        ) : (
          <TrendDown size={12} weight="bold" aria-hidden="true" />
        )}
        {Math.abs(delta).toFixed(1)}%
      </span>
      <span className="text-xs text-muted-foreground">{deltaLabel}</span>
    </div>
  )
})

/**
 * Sparkline sub-component.
 */
const Sparkline = memo(function Sparkline({ data }: { data: number[] }) {
  // Memoize normalized heights
  const normalizedHeights = useMemo(() => {
    const maxValue = Math.max(...data, 1)
    return data.map((v) => (v / maxValue) * 100)
  }, [data])

  if (data.length === 0) return null

  return (
    <div className="mt-auto pt-2">
      <svg
        width="100%"
        height="24"
        viewBox="0 0 140 24"
        preserveAspectRatio="none"
        className="overflow-visible"
        role="img"
        aria-label="Trend visualization"
      >
        {normalizedHeights.map((height, i) => (
          <rect
            key={i}
            x={i * 20}
            y={24 - (height * 24) / 100}
            width="16"
            height={Math.max((height * 24) / 100, 1)}
            rx="2"
            className="fill-primary/40"
          />
        ))}
      </svg>
    </div>
  )
})

/**
 * StatCardFull component with count-up animation.
 */
const StatCardFull = memo(function StatCardFull({
  title,
  subtitle,
  value,
  unit,
  delta,
  deltaLabel = "vs last period",
  sparkData = [],
  icon,
  positiveIsGood = false,
}: StatCardFullProps) {
  const [displayValue, setDisplayValue] = useState<number | string>(
    typeof value === "number" ? 0 : value
  )
  const animationRef = useRef<number | null>(null)
  const hasAnimatedRef = useRef(false)

  // Animated count-up on mount with proper cleanup
  useEffect(() => {
    if (typeof value !== "number") {
      setDisplayValue(value)
      return
    }

    // Only animate once
    if (hasAnimatedRef.current) {
      setDisplayValue(value)
      return
    }

    hasAnimatedRef.current = true
    const duration = 1200
    const startTime = performance.now()
    const startValue = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + (value - startValue) * eased)

      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value])

  // Memoize delta calculation
  const deltaIsGood = useMemo(() => {
    if (delta === undefined) return false
    const deltaIsPositive = delta > 0
    return positiveIsGood ? deltaIsPositive : !deltaIsPositive
  }, [delta, positiveIsGood])

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums text-foreground">
          {typeof displayValue === "number"
            ? displayValue.toLocaleString()
            : displayValue}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>

      {/* Delta badge */}
      {delta !== undefined && (
        <DeltaBadge delta={delta} deltaLabel={deltaLabel} isGood={deltaIsGood} />
      )}

      {/* Sparkline */}
      {sparkData.length > 0 && <Sparkline data={sparkData} />}
    </div>
  )
})

export { StatCardFull }
export default StatCardFull
