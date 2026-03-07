/**
 * ZoneSheet — Slide-over sheet showing zone details.
 * Contains Details, Timeline, and Log Incident tabs.
 * All form inputs are controlled via props for state management.
 */

import { useCallback, type FormEvent } from "react"
import { X, MapPin, Warning, Clock, Users } from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import { RiskBadge, type RiskLevel } from "@rie-civicpulse/ui/components/risk-badge"
import { Button } from "@rie-civicpulse/ui/components/button"

// TODO: wire activeZoneAtom from atoms/map.atoms.ts
// TODO: wire zoneSheetOpenAtom from atoms/map.atoms.ts
// TODO: connect form submit to incident mutation

export type IncidentType = "fire" | "flood" | "crime" | "medical" | "infrastructure" | "weather"
export type IncidentStatus = "open" | "in_progress" | "resolved"

export interface IncidentFormData {
  incidentType: IncidentType | ""
  severity: RiskLevel
  location: string
  description: string
  responders: number
  status: IncidentStatus
}

export interface TimelineEntry {
  id: string
  type: string
  severity: RiskLevel
  timestamp: string
  description: string
}

export interface ZoneSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  zoneName?: string
  barangay?: string
  district?: number
  riskLevel?: RiskLevel
  coordinates?: [number, number]
  incidentCount?: number
  /** Current active tab */
  activeTab?: "details" | "timeline" | "log"
  onTabChange?: (tab: "details" | "timeline" | "log") => void
  /** Form data for Log Incident tab (controlled) */
  formData?: IncidentFormData
  onFormChange?: (data: IncidentFormData) => void
  onSubmitIncident?: (data: IncidentFormData) => void
  /** Timeline data */
  timelineEntries?: TimelineEntry[]
  /** Stats for Details tab */
  activeAlerts?: number
  respondersCount?: number
  avgResponseTime?: string
  coverage?: string
}

const TABS = [
  { id: "details" as const, label: "Details" },
  { id: "timeline" as const, label: "Timeline" },
  { id: "log" as const, label: "Log Incident" },
]

const INCIDENT_TYPES = [
  { value: "fire", label: "Fire" },
  { value: "flood", label: "Flood" },
  { value: "crime", label: "Crime" },
  { value: "medical", label: "Medical" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "weather", label: "Weather" },
]

const SEVERITY_LEVELS = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
]

const DEFAULT_FORM_DATA: IncidentFormData = {
  incidentType: "",
  severity: "medium",
  location: "",
  description: "",
  responders: 1,
  status: "open",
}

const DEFAULT_TIMELINE: TimelineEntry[] = [
  { id: "1", type: "Fire", severity: "high", timestamp: "2 hours ago", description: "Structural fire reported at commercial building" },
  { id: "2", type: "Medical", severity: "medium", timestamp: "5 hours ago", description: "Medical emergency, ambulance dispatched" },
  { id: "3", type: "Infrastructure", severity: "low", timestamp: "1 day ago", description: "Road maintenance completed" },
]

function ZoneSheet({
  open,
  onOpenChange,
  zoneName = "Zone A",
  barangay = "Barangay Central",
  district = 1,
  riskLevel = "medium",
  coordinates = [124.5908, 12.0685],
  incidentCount = 12,
  activeTab = "details",
  onTabChange,
  formData = DEFAULT_FORM_DATA,
  onFormChange,
  onSubmitIncident,
  timelineEntries = DEFAULT_TIMELINE,
  activeAlerts = 3,
  respondersCount = 8,
  avgResponseTime = "4.2m",
  coverage = "92%",
}: ZoneSheetProps) {
  // Handler for closing sheet
  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  // Handler for tab change
  const handleTabChange = useCallback(
    (tab: "details" | "timeline" | "log") => {
      onTabChange?.(tab)
    },
    [onTabChange]
  )

  // Handler for form field changes
  const handleFieldChange = useCallback(
    (field: keyof IncidentFormData, value: string | number) => {
      onFormChange?.({
        ...formData,
        [field]: value,
      })
    },
    [formData, onFormChange]
  )

  // Handler for form submission
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (formData.incidentType) {
        onSubmitIncident?.(formData as IncidentFormData)
      }
    },
    [formData, onSubmitIncident]
  )

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="zone-sheet-title"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-[420px] flex-col border-l border-border bg-card shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 id="zone-sheet-title" className="text-lg font-semibold text-foreground">
              {zoneName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {barangay} · District {district}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Details Tab */}
          {activeTab === "details" && (
            <div
              id="tabpanel-details"
              role="tabpanel"
              aria-labelledby="tab-details"
              className="space-y-4"
            >
              {/* Risk level and incident count */}
              <div className="flex items-center justify-between">
                <RiskBadge level={riskLevel} pulse={riskLevel === "critical"} />
                <span className="text-sm text-muted-foreground">
                  {incidentCount} incidents
                </span>
              </div>

              {/* Mini stat cards grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Warning size={14} />
                    <span className="text-xs">Active Alerts</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-foreground">{activeAlerts}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users size={14} />
                    <span className="text-xs">Responders</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-foreground">{respondersCount}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={14} />
                    <span className="text-xs">Avg Response</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-foreground">{avgResponseTime}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={14} />
                    <span className="text-xs">Coverage</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-foreground">{coverage}</p>
                </div>
              </div>

              {/* Coordinates */}
              {coordinates && (
                <p className="text-xs text-muted-foreground">
                  Coordinates: {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}
                </p>
              )}

              {/* Placeholder chart area */}
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6">
                <p className="text-center text-sm text-muted-foreground">
                  Zone activity chart placeholder
                </p>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div
              id="tabpanel-timeline"
              role="tabpanel"
              aria-labelledby="tab-timeline"
              className="space-y-4"
            >
              {timelineEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="relative border-l-2 border-border pb-4 pl-4 last:pb-0"
                >
                  <div
                    className={cn(
                      "absolute -left-1.5 top-0 size-3 rounded-full",
                      entry.severity === "critical" && "bg-destructive",
                      entry.severity === "high" && "bg-accent",
                      entry.severity === "medium" && "bg-primary",
                      entry.severity === "low" && "bg-green-400"
                    )}
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Incident #{index + 1}00{index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.type} · {entry.timestamp}
                      </p>
                    </div>
                    <RiskBadge level={entry.severity} size="sm" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Log Incident Tab */}
          {activeTab === "log" && (
            <form
              id="tabpanel-log"
              role="tabpanel"
              aria-labelledby="tab-log"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              {/* Incident Type */}
              <div className="space-y-1.5">
                <label htmlFor="incident-type" className="text-sm font-medium text-foreground">
                  Incident Type
                </label>
                <select
                  id="incident-type"
                  value={formData.incidentType}
                  onChange={(e) => handleFieldChange("incidentType", e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select type...</option>
                  {INCIDENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <fieldset className="space-y-1.5">
                <legend className="text-sm font-medium text-foreground">Severity</legend>
                <div className="flex gap-2">
                  {SEVERITY_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className={cn(
                        "flex flex-1 cursor-pointer items-center justify-center rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                        formData.severity === level.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="severity"
                        value={level.value}
                        checked={formData.severity === level.value}
                        onChange={(e) => handleFieldChange("severity", e.target.value)}
                        className="sr-only"
                      />
                      {level.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Location */}
              <div className="space-y-1.5">
                <label htmlFor="location" className="text-sm font-medium text-foreground">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Coordinates or address"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Describe the incident..."
                />
              </div>

              {/* Responders */}
              <div className="space-y-1.5">
                <label htmlFor="responders" className="text-sm font-medium text-foreground">
                  Responders Needed
                </label>
                <input
                  id="responders"
                  type="number"
                  min={0}
                  max={20}
                  value={formData.responders}
                  onChange={(e) => handleFieldChange("responders", parseInt(e.target.value) || 0)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label htmlFor="status" className="text-sm font-medium text-foreground">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full">
                Log Incident
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export { ZoneSheet }
export default ZoneSheet
