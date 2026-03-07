/**
 * RiskBadge — Small colored badge for risk/severity levels.
 * Supports risk levels, severity levels, and incident statuses.
 */

import { cn } from "@rie-civicpulse/ui/lib/utils"

type RiskLevel = "critical" | "high" | "medium" | "low"
type SeverityLevel = "critical" | "high" | "medium" | "low"
type IncidentStatus = "open" | "in_progress" | "resolved"

export interface RiskBadgeProps {
  level: RiskLevel | SeverityLevel | IncidentStatus
  size?: "sm" | "md"
  /** Animated dot for open/critical states */
  pulse?: boolean
}

const levelConfig: Record<
  RiskLevel | SeverityLevel | IncidentStatus,
  { bg: string; text: string; label: string }
> = {
  critical: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    label: "Critical",
  },
  high: {
    bg: "bg-accent/15",
    text: "text-accent",
    label: "High",
  },
  medium: {
    bg: "bg-primary/15",
    text: "text-primary",
    label: "Medium",
  },
  low: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    label: "Low",
  },
  open: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    label: "Open",
  },
  in_progress: {
    bg: "bg-accent/15",
    text: "text-accent",
    label: "In Progress",
  },
  resolved: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    label: "Resolved",
  },
}

function RiskBadge({ level, size = "md", pulse = false }: RiskBadgeProps) {
  const config = levelConfig[level]
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
      {shouldPulse && (
        <span className="relative flex size-2">
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-75",
              level === "critical" || level === "open"
                ? "bg-destructive"
                : "bg-current"
            )}
          />
          <span
            className={cn(
              "relative inline-flex size-2 rounded-full",
              level === "critical" || level === "open"
                ? "bg-destructive"
                : "bg-current"
            )}
          />
        </span>
      )}
      {config.label}
    </span>
  )
}

export { RiskBadge }
export type { RiskLevel, SeverityLevel, IncidentStatus }
export default RiskBadge
