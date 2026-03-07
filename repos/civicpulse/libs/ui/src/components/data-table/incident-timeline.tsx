"use client"

/**
 * IncidentTimeline
 * Horizontal timeline showing incident lifecycle stages.
 * Steps: Reported → Dispatched → Resolved
 * Active nodes pulse when status is open or in_progress.
 */

import { memo, useMemo } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import type { IncidentStatus } from "../risk-badge"

export interface IncidentTimelineProps {
  status: IncidentStatus
  reportedAt: string
  /** Minutes from reported to resolved (if resolved) */
  resolutionMinutes?: number
  className?: string
}

interface TimelineStep {
  label: string
  timestamp?: string
  deltaLabel?: string
  active: boolean
  complete: boolean
  pulse: boolean
}

function IncidentTimelineComponent({
  status,
  reportedAt,
  resolutionMinutes,
  className,
}: IncidentTimelineProps) {
  // Build timeline steps
  const steps = useMemo<TimelineStep[]>(() => {
    const reportedDate = new Date(reportedAt)
    const reportedTime = reportedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })

    // Simulated dispatch time (~6 min after report)
    const dispatchedDate = new Date(reportedDate.getTime() + 6 * 60 * 1000)
    const dispatchedTime = dispatchedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })

    // Resolution time
    const resolvedDate = resolutionMinutes
      ? new Date(reportedDate.getTime() + resolutionMinutes * 60 * 1000)
      : null
    const resolvedTime = resolvedDate
      ? resolvedDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : null

    return [
      {
        label: "Reported",
        timestamp: reportedTime,
        active: true,
        complete: true,
        pulse: false,
      },
      {
        label: "Dispatched",
        timestamp:
          status === "in_progress" || status === "resolved"
            ? dispatchedTime
            : undefined,
        deltaLabel: status !== "open" ? "+6m" : undefined,
        active: status === "in_progress" || status === "resolved",
        complete: status === "in_progress" || status === "resolved",
        pulse: status === "in_progress",
      },
      {
        label: status === "resolved" ? "Resolved" : "Open",
        timestamp: resolvedTime ?? undefined,
        deltaLabel:
          status === "resolved" && resolutionMinutes
            ? `+${resolutionMinutes}m`
            : undefined,
        active: status === "resolved",
        complete: status === "resolved",
        pulse: status === "open" || status === "in_progress",
      },
    ]
  }, [status, reportedAt, resolutionMinutes])

  return (
    <div className={cn("flex items-start gap-2", className)}>
      {steps.map((step, idx) => (
        <div key={step.label} className="flex flex-1 flex-col items-center">
          {/* Node + connector */}
          <div className="flex w-full items-center">
            {/* Connector before */}
            {idx > 0 && (
              <div
                className={cn(
                  "h-0.5 flex-1",
                  step.complete ? "bg-success" : "bg-muted"
                )}
              />
            )}

            {/* Node */}
            <div className="relative">
              {step.pulse && (
                <span
                  className={cn(
                    "absolute -inset-1 animate-ping rounded-full opacity-75",
                    step.active ? "bg-success" : "bg-muted"
                  )}
                />
              )}
              <div
                className={cn(
                  "relative size-3 rounded-full",
                  step.complete
                    ? "bg-success"
                    : step.active
                      ? "bg-warning"
                      : "bg-muted"
                )}
              />
            </div>

            {/* Connector after */}
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1",
                  steps[idx + 1].complete ? "bg-success" : "bg-muted"
                )}
              />
            )}
          </div>

          {/* Labels */}
          <div className="mt-2 text-center">
            <p className="text-xs font-medium text-foreground">{step.label}</p>
            {step.timestamp && (
              <p className="font-mono text-[10px] text-muted-foreground">
                {step.timestamp}
              </p>
            )}
            {step.deltaLabel && (
              <p className="text-[10px] text-muted-foreground">
                ({step.deltaLabel})
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

IncidentTimelineComponent.displayName = "IncidentTimeline"

export const IncidentTimeline = memo(IncidentTimelineComponent)
export default IncidentTimeline
