"use client"

/**
 * IncidentTypeBadge — Colored badge with icon for incident type.
 * Supports 6 incident types with unique colors and Phosphor icons.
 * Wrapped in React.memo for performance in tables/lists.
 */

import { memo, useMemo, type ComponentType } from "react"
import {
  Flame,
  Waves,
  ShieldWarning,
  HeartPulse,
  Wrench,
  CloudLightning,
  type IconProps,
} from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

export type IncidentType =
  | "fire"
  | "flood"
  | "crime"
  | "medical"
  | "infrastructure"
  | "weather"

export interface IncidentTypeBadgeProps {
  type: IncidentType
  size?: "sm" | "md"
  /** Whether to show the icon */
  showIcon?: boolean
}

interface TypeConfig {
  icon: ComponentType<IconProps>
  bg: string
  text: string
  label: string
}

const TYPE_CONFIG: Record<IncidentType, TypeConfig> = {
  fire: {
    icon: Flame,
    bg: "bg-destructive/15",
    text: "text-destructive",
    label: "Fire",
  },
  flood: {
    icon: Waves,
    bg: "bg-primary/15",
    text: "text-primary",
    label: "Flood",
  },
  crime: {
    icon: ShieldWarning,
    bg: "bg-accent/15",
    text: "text-accent",
    label: "Crime",
  },
  medical: {
    icon: HeartPulse,
    bg: "bg-green-500/15",
    text: "text-green-400",
    label: "Medical",
  },
  infrastructure: {
    icon: Wrench,
    bg: "bg-violet-500/15",
    text: "text-violet-400",
    label: "Infrastructure",
  },
  weather: {
    icon: CloudLightning,
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
    label: "Weather",
  },
}

/**
 * IncidentTypeBadge component.
 * Frequently rendered in tables, so wrapped in React.memo.
 */
const IncidentTypeBadge = memo(function IncidentTypeBadge({
  type,
  size = "md",
  showIcon = true,
}: IncidentTypeBadgeProps) {
  // Memoize config lookup
  const config = useMemo(() => TYPE_CONFIG[type], [type])
  const Icon = config.icon
  const iconSize = size === "sm" ? 12 : 14

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
      {showIcon && (
        <Icon size={iconSize} weight="duotone" aria-hidden="true" />
      )}
      {config.label}
    </span>
  )
})

export { IncidentTypeBadge }
export default IncidentTypeBadge
