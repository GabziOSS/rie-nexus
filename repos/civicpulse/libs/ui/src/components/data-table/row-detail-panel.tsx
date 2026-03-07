"use client"

/**
 * RowDetailPanel
 * Expandable detail section that appears below selected row.
 * Contains IncidentTimeline and description details.
 * Smooth expand/collapse animation.
 */

import { memo } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import { X, MapPin, User, Clock, FileText } from "@phosphor-icons/react"
import { RiskBadge, type RiskLevel, type IncidentStatus } from "../risk-badge"
import { IncidentTypeBadge, type IncidentType } from "../incident-type-badge"
import IncidentTimeline from "./incident-timeline"

export interface RowDetailPanelProps {
  /** Whether the panel is open */
  open: boolean
  onClose?: () => void
  /** Incident data */
  incident?: {
    id: string
    type: IncidentType
    status: IncidentStatus
    severity: RiskLevel
    location: string
    barangay: string
    reportedAt: string
    respondersAssigned: number
    description?: string
    resolutionMinutes?: number
  }
  className?: string
}

function RowDetailPanelComponent({
  open,
  onClose,
  incident,
  className,
}: RowDetailPanelProps) {
  if (!open || !incident) return null

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-lg border border-border bg-card p-4",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">
            {incident.id}
          </span>
          <IncidentTypeBadge type={incident.type} size="sm" />
          <RiskBadge
            level={incident.status}
            size="sm"
            pulse={incident.status === "open"}
          />
          <RiskBadge level={incident.severity} size="sm" showDot />
        </div>
        <button
          onClick={onClose}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close details"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Details */}
        <div className="space-y-4">
          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {incident.location}
              </p>
              <p className="text-xs text-muted-foreground">
                Brgy. {incident.barangay}
              </p>
            </div>
          </div>

          {/* Responders */}
          <div className="flex items-center gap-2">
            <User size={16} className="text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium text-foreground">
                {incident.respondersAssigned}
              </span>
              <span className="text-muted-foreground"> responders assigned</span>
            </div>
          </div>

          {/* Reported time */}
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Reported{" "}
              <span className="font-medium text-foreground">
                {new Date(incident.reportedAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          {incident.description && (
            <div className="flex items-start gap-2">
              <FileText size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {incident.description}
              </p>
            </div>
          )}
        </div>

        {/* Right: Timeline */}
        <div className="border-l border-border pl-6">
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Timeline
          </h4>
          <IncidentTimeline
            status={incident.status}
            reportedAt={incident.reportedAt}
            resolutionMinutes={incident.resolutionMinutes}
          />
        </div>
      </div>
    </div>
  )
}

RowDetailPanelComponent.displayName = "RowDetailPanel"

export const RowDetailPanel = memo(RowDetailPanelComponent)
export default RowDetailPanel
