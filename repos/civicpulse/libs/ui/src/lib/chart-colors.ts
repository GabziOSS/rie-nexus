/**
 * Chart color constants.
 * All values reference CSS variables so theme switching recolors all charts.
 * Never use hardcoded hex in chart components.
 */
export const CHART_COLORS = {
  fire: "hsl(var(--destructive))",
  flood: "hsl(var(--primary))",
  crime: "hsl(var(--accent))",
  medical: "hsl(142 71% 45%)",
  infrastructure: "hsl(270 75% 65%)",
  weather: "hsl(199 98% 58%)",
  primary: "hsl(var(--primary))",
  accent: "hsl(var(--accent))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
  muted: "hsl(var(--muted-foreground))",
  border: "hsl(var(--border))",
} as const

export type ChartColorKey = keyof typeof CHART_COLORS

/** Recharts shared axis props — apply to every CartesianChart */
export const AXIS_PROPS = {
  tick: {
    fill: "hsl(var(--muted-foreground))",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
  },
  axisLine: { stroke: "hsl(var(--border))" },
  tickLine: false,
} as const

/** Recharts shared tooltip style */
export const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
  fontSize: 12,
  fontFamily: "var(--font-mono)",
} as const

/** Recharts shared CartesianGrid props */
export const GRID_PROPS = {
  strokeDasharray: "3 3",
  stroke: "hsl(var(--border))",
  opacity: 0.4,
} as const

/** Incident type to color mapping for charts */
export const INCIDENT_TYPE_COLORS: Record<string, string> = {
  fire: CHART_COLORS.fire,
  flood: CHART_COLORS.flood,
  crime: CHART_COLORS.crime,
  medical: CHART_COLORS.medical,
  infrastructure: CHART_COLORS.infrastructure,
  weather: CHART_COLORS.weather,
}

/** Severity level to color mapping */
export const SEVERITY_COLORS: Record<string, string> = {
  critical: CHART_COLORS.destructive,
  high: CHART_COLORS.warning,
  medium: CHART_COLORS.primary,
  low: CHART_COLORS.success,
}
