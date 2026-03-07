/**
 * CivicPulse UI Component Library
 * Re-exports all components for convenient imports.
 *
 * Usage:
 *   import { Button, ThemeProvider, Sidebar } from "@rie-civicpulse/ui/components"
 *
 * Or import individual components:
 *   import { Button } from "@rie-civicpulse/ui/components/button"
 */

// ─────────────────────────────────────────────────────────────────
// Core UI Components
// ─────────────────────────────────────────────────────────────────
export { Button, buttonVariants } from "./button"

// ─────────────────────────────────────────────────────────────────
// Theme Components
// ─────────────────────────────────────────────────────────────────
export { ThemeProvider, useTheme } from "./theme-provider"
export type { ThemeProviderProps } from "./theme-provider"

export { ThemeSwitcher } from "./theme-switcher"
export type { ThemeSwitcherProps } from "./theme-switcher"

// ─────────────────────────────────────────────────────────────────
// Layout Components
// ─────────────────────────────────────────────────────────────────
export { AppShell } from "./app-shell"
export type { AppShellProps } from "./app-shell"

export { Sidebar } from "./sidebar"
export type { SidebarProps } from "./sidebar"

export { TopBar } from "./top-bar"
export type { TopBarProps, BreadcrumbItem } from "./top-bar"

// ─────────────────────────────────────────────────────────────────
// Data Display Components
// ─────────────────────────────────────────────────────────────────
export { StatCardFull } from "./stat-card-full"
export type { StatCardFullProps } from "./stat-card-full"

export { ChartBlock } from "./chart-block"
export type { ChartBlockProps } from "./chart-block"

// ─────────────────────────────────────────────────────────────────
// Badge Components
// ─────────────────────────────────────────────────────────────────
export { RiskBadge } from "./risk-badge"
export type {
  RiskBadgeProps,
  RiskLevel,
  SeverityLevel,
  IncidentStatus as RiskIncidentStatus,
} from "./risk-badge"

export { IncidentTypeBadge } from "./incident-type-badge"
export type {
  IncidentTypeBadgeProps,
  IncidentType,
} from "./incident-type-badge"

// ─────────────────────────────────────────────────────────────────
// Sheet & Drawer Components
// ─────────────────────────────────────────────────────────────────
export { ZoneSheet } from "./zone-sheet"
export type {
  ZoneSheetProps,
  IncidentFormData,
  TimelineEntry,
  IncidentType as ZoneIncidentType,
  IncidentStatus as ZoneIncidentStatus,
} from "./zone-sheet"

export { LayerDrawer } from "./layer-drawer"
export type { LayerDrawerProps, LayerConfig } from "./layer-drawer"
