/**
 * TanStack Query key factory for CivicPulse.
 * Provides type-safe, hierarchical query keys for all data access patterns.
 * Uses factory pattern for consistent key structure and invalidation.
 */

// TODO: wire to actual API endpoints when backend is ready

/**
 * Query key factory following TanStack Query best practices.
 * Keys are structured as arrays for hierarchical invalidation.
 */
export const queryKeys = {
  // ─────────────────────────────────────────────────────────────────
  // Zones
  // ─────────────────────────────────────────────────────────────────
  zones: {
    all: ["zones"] as const,
    lists: () => [...queryKeys.zones.all, "list"] as const,
    list: (filters?: { district?: number; riskLevel?: string }) =>
      [...queryKeys.zones.lists(), filters] as const,
    details: () => [...queryKeys.zones.all, "detail"] as const,
    detail: (zoneId: string) => [...queryKeys.zones.details(), zoneId] as const,
    geoJSON: () => [...queryKeys.zones.all, "geojson"] as const,
  },

  // ─────────────────────────────────────────────────────────────────
  // Incidents
  // ─────────────────────────────────────────────────────────────────
  incidents: {
    all: ["incidents"] as const,
    lists: () => [...queryKeys.incidents.all, "list"] as const,
    list: (filters?: {
      zoneId?: string
      type?: string
      status?: string
      severity?: string
      dateRange?: { start: string; end: string }
    }) => [...queryKeys.incidents.lists(), filters] as const,
    details: () => [...queryKeys.incidents.all, "detail"] as const,
    detail: (incidentId: string) =>
      [...queryKeys.incidents.details(), incidentId] as const,
    byZone: (zoneId: string) =>
      [...queryKeys.incidents.all, "byZone", zoneId] as const,
    recent: (limit?: number) =>
      [...queryKeys.incidents.all, "recent", limit ?? 10] as const,
  },

  // ─────────────────────────────────────────────────────────────────
  // Metrics & Statistics
  // ─────────────────────────────────────────────────────────────────
  metrics: {
    all: ["metrics"] as const,
    summary: () => [...queryKeys.metrics.all, "summary"] as const,
    trend: (metricId: string, period: "7d" | "30d" | "90d" | "365d") =>
      [...queryKeys.metrics.all, "trend", metricId, period] as const,
    dashboard: () => [...queryKeys.metrics.all, "dashboard"] as const,
  },

  // ─────────────────────────────────────────────────────────────────
  // Charts & Visualizations
  // ─────────────────────────────────────────────────────────────────
  charts: {
    all: ["charts"] as const,
    incidentsByType: () => [...queryKeys.charts.all, "incidentsByType"] as const,
    riskDistribution: () =>
      [...queryKeys.charts.all, "riskDistribution"] as const,
    responseTime: (period?: "7d" | "30d" | "90d") =>
      [...queryKeys.charts.all, "responseTime", period ?? "30d"] as const,
    heatmap: () => [...queryKeys.charts.all, "heatmap"] as const,
    calendar: (year?: number, month?: number) =>
      [...queryKeys.charts.all, "calendar", year, month] as const,
    districtRisk: () => [...queryKeys.charts.all, "districtRisk"] as const,
    responderReadiness: () =>
      [...queryKeys.charts.all, "responderReadiness"] as const,
  },

  // ─────────────────────────────────────────────────────────────────
  // Users & Auth
  // ─────────────────────────────────────────────────────────────────
  users: {
    all: ["users"] as const,
    current: () => [...queryKeys.users.all, "current"] as const,
    list: () => [...queryKeys.users.all, "list"] as const,
    detail: (userId: string) => [...queryKeys.users.all, "detail", userId] as const,
  },

  // ─────────────────────────────────────────────────────────────────
  // Notifications
  // ─────────────────────────────────────────────────────────────────
  notifications: {
    all: ["notifications"] as const,
    unread: () => [...queryKeys.notifications.all, "unread"] as const,
    list: (page?: number) =>
      [...queryKeys.notifications.all, "list", page ?? 1] as const,
  },
} as const

/**
 * Type helper for extracting query key types.
 */
export type QueryKeys = typeof queryKeys
