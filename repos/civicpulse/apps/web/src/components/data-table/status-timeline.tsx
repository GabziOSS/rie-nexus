import { formatDistance } from "date-fns"
import type { Incident } from "@rie-civicpulse/mock-data/types"

interface StatusTimelineProps {
  incident: Incident
}

export function StatusTimeline({ incident }: StatusTimelineProps) {
  const reportedDate = new Date(incident.reportedAt)
  const resolvedDate = incident.resolvedAt
    ? new Date(incident.resolvedAt)
    : null
  const now = new Date()

  const isOpen =
    incident.status === "reported" || incident.status === "investigating"
  const isResolved =
    incident.status === "resolved" || incident.status === "closed"

  const reportedTime = formatDistance(reportedDate, now, { addSuffix: true })
  const resolvedTime = resolvedDate
    ? formatDistance(resolvedDate, now, { addSuffix: true })
    : null

  return (
    <div className="space-y-3">
      {/* Reported */}
      <div className="flex items-start gap-3">
        <div className="relative flex flex-col items-center">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
              isOpen
                ? "border-destructive bg-destructive/20"
                : "border-green-500 bg-green-500/20"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isOpen ? "bg-destructive" : "bg-green-500"
              }`}
            />
          </div>
          {(resolvedDate || isOpen) && <div className="bg-border h-8 w-0.5" />}
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-foreground text-xs font-semibold">Reported</p>
          <p className="text-muted-foreground text-xs">{reportedTime}</p>
        </div>
      </div>

      {/* Investigating/Dispatched */}
      {(isOpen || isResolved) && (
        <div className="flex items-start gap-3">
          <div className="relative flex flex-col items-center">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                isOpen
                  ? "border-accent bg-accent/20"
                  : "border-green-500 bg-green-500/20"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  isOpen ? "bg-accent" : "bg-green-500"
                }`}
              />
            </div>
            {resolvedDate && <div className="bg-border h-8 w-0.5" />}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-foreground text-xs font-semibold">
              Investigating
            </p>
            <p className="text-muted-foreground text-xs">
              {isOpen ? "In progress" : "Completed"}
            </p>
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolvedDate && (
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-green-500 bg-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-foreground text-xs font-semibold">Resolved</p>
            <p className="text-muted-foreground text-xs">{resolvedTime}</p>
          </div>
        </div>
      )}

      {/* Pulsing animation for open incidents */}
      {isOpen && (
        <style>{`
          @keyframes pulse-timeline {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .timeline-pulse {
            animation: pulse-timeline 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      )}
    </div>
  )
}
