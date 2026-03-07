"use client"

/**
 * RiskBadge — Small colored badge for risk/severity levels.
 * Supports risk levels, severity levels, and incident statuses.
 * Wrapped in React.memo for performance in lists.
 */

import { memo, useMemo } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export type RiskLevel = "critical" | "high" | "medium" | "low"
export type SeverityLevel = "critical" | "high" | "medium" | "low"
export type IncidentStatus = "open" | "in_progress" | "resolved"

export interface RiskBadgeProps {
  level: RiskLevel | SeverityLevel | IncidentStatus
  size?: "sm" | "md"
  /** Animated dot for open/critical states */
  pulse?: boolean
  /** Show dot indicator on left */
  showDot?: boolean
}

interface LevelConfig {
  bg: string
  text: string
  label: string
  dotColor: string
}

const LEVEL_CONFIG: Record<RiskLevel | SeverityLevel | IncidentStatus, LevelConfig> = {
  critical: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    label: "Critical",
    dotColor: "bg-destructive",
  },
  high: {
    bg: "bg-accent/15",
    text: "text-accent",
    label: "High",
    dotColor: "bg-accent",
  },
  medium: {
    bg: "bg-primary/15",
    text: "text-primary",
    label: "Medium",
    dotColor: "bg-primary",
  },
  low: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    label: "Low",
    dotColor: "bg-green-400",
  },
  open: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    label: "Open",
    dotColor: "bg-destructive",
  },
  in_progress: {
    bg: "bg-accent/15",
    text: "text-accent",
    label: "In Progress",
    dotColor: "bg-accent",
  },
  resolved: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    label: "Resolved",
    dotColor: "bg-green-400",
  },
}

/**
 * RiskBadge component.
 * Frequently rendered in tables/lists, so wrapped in React.memo.
 */
const RiskBadge = memo(function RiskBadge({
  level,
  size = "md",
  pulse = false,
  showDot = false,
}: RiskBadgeProps) {
  // Memoize config lookup
  const config = useMemo(() => LEVEL_CONFIG[level], [level])
  const shouldPulse = pulse && (level === "critical" || level === "open")

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.bg,
        config.text,
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-xs"
      )}
    >
      {/* Pulse dot for critical/open states */}
      {(shouldPulse || showDot) && (
        <span className="relative flex size-2" aria-hidden="true">
          {shouldPulse && (
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                config.dotColor
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex size-2 rounded-full",
              config.dotColor
            )}
          />
        </span>
      )}
      {config.label}
    </span>
  )
})

export { RiskBadge }
export default RiskBadge
