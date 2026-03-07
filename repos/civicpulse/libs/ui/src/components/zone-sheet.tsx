/**
 * ZoneSheet — Slide-over sheet showing zone details.
 * Contains Details, Timeline, and Log Incident tabs.
 * Markup only — no MapLibre, no data logic.
 */

import { useState } from "react"
import { X, MapPin, Warning, Clock, Users } from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import { RiskBadge, type RiskLevel } from "@rie-civicpulse/ui/components/risk-badge"
import { Button } from "@rie-civicpulse/ui/components/button"

// TODO: wire activeZoneAtom from atoms/map.atoms.ts
// TODO: wire zoneSheetOpenAtom from atoms/map.atoms.ts
// TODO: connect form submit to incident mutation

export interface ZoneSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  zoneName?: string
  barangay?: string
  district?: number
  riskLevel?: RiskLevel
  coordinates?: [number, number]
  incidentCount?: number
}

type TabId = "details" | "timeline" | "log"

const tabs: { id: TabId; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "timeline", label: "Timeline" },
  { id: "log", label: "Log Incident" },
]

const incidentTypes = [
  { value: "fire", label: "Fire" },
  { value: "flood", label: "Flood" },
  { value: "crime", label: "Crime" },
  { value: "medical", label: "Medical" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "weather", label: "Weather" },
]

const severityLevels = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
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
}: ZoneSheetProps) {
  const [activeTab, setActiveTab] = useState<TabId>("details")
  const [formData, setFormData] = useState({
    incidentType: "",
    severity: "medium",
    location: coordinates ? `${coordinates[1]}, ${coordinates[0]}` : "",
    description: "",
    responders: 1,
    status: "open",
  })

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-[420px] flex-col border-l border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{zoneName}</h2>
            <p className="text-sm text-muted-foreground">
              {barangay} · District {district}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
            <div className="space-y-4">
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
                  <p className="mt-1 text-xl font-semibold text-foreground">3</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users size={14} />
                    <span className="text-xs">Responders</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-foreground">8</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={14} />
                    <span className="text-xs">Avg Response</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-foreground">4.2m</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={14} />
                    <span className="text-xs">Coverage</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-foreground">92%</p>
                </div>
              </div>

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
            <div className="space-y-4">
              {/* Placeholder incident entries */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative border-l-2 border-border pl-4 pb-4 last:pb-0"
                >
                  <div className="absolute -left-1.5 top-0 size-3 rounded-full bg-primary" />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Incident #{i}00{i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1 ? "Fire" : i === 2 ? "Medical" : "Infrastructure"} ·{" "}
                        {i === 1 ? "2 hours ago" : i === 2 ? "5 hours ago" : "1 day ago"}
                      </p>
                    </div>
                    <RiskBadge
                      level={i === 1 ? "high" : i === 2 ? "medium" : "low"}
                      size="sm"
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {i === 1
                      ? "Structural fire reported at commercial building"
                      : i === 2
                        ? "Medical emergency, ambulance dispatched"
                        : "Road maintenance completed"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Log Incident Tab */}
          {activeTab === "log" && (
            <form className="space-y-4">
              {/* Incident Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Incident Type
                </label>
                <select
                  value={formData.incidentType}
                  onChange={(e) =>
                    setFormData({ ...formData, incidentType: e.target.value })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select type...</option>
                  {incidentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Severity
                </label>
                <div className="flex gap-2">
                  {severityLevels.map((level) => (
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
                        onChange={(e) =>
                          setFormData({ ...formData, severity: e.target.value })
                        }
                        className="sr-only"
                      />
                      {level.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Coordinates or address"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Describe the incident..."
                />
              </div>

              {/* Responders */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Responders Needed
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.responders}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responders: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statusOptions.map((status) => (
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
