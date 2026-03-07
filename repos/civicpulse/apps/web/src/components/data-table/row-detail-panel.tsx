import { MapPin, Phone, CheckCircle, PencilSimple } from "@phosphor-icons/react"
import type { Incident } from "@rie-civicpulse/mock-data/types"
import { ZONES } from "@rie-civicpulse/mock-data"
import { StatusTimeline } from "./status-timeline"

interface RowDetailPanelProps {
  incident: Incident
}

export function RowDetailPanel({ incident }: RowDetailPanelProps) {
  const zone = ZONES.find((z) => z.id === incident.zoneId)

  return (
    <div className="border-border bg-muted/20 space-y-4 border-t px-4 py-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <h4 className="text-muted-foreground text-xs font-semibold">
              Location
            </h4>
            <div className="mt-1 flex items-start gap-2">
              <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{zone?.name}</p>
                <p className="text-muted-foreground text-xs">
                  {incident.location.address}
                </p>
                <p className="text-muted-foreground text-xs">
                  {incident.location.coordinates[1].toFixed(4)}°,{" "}
                  {incident.location.coordinates[0].toFixed(4)}°
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-muted-foreground text-xs font-semibold">
              Description
            </h4>
            <p className="text-foreground mt-1 text-sm">
              {incident.description}
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div>
            <h4 className="text-muted-foreground text-xs font-semibold">
              Timeline
            </h4>
            <div className="mt-2">
              <StatusTimeline incident={incident} />
            </div>
          </div>

          {incident.assignedTo && (
            <div>
              <h4 className="text-muted-foreground text-xs font-semibold">
                Assigned Responder
              </h4>
              <div className="mt-1 flex items-center gap-2">
                <Phone size={16} className="text-green-500" />
                <span className="text-sm font-medium">
                  {incident.assignedTo}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-border flex gap-2 border-t pt-4">
        <button className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors">
          <PencilSimple size={16} />
          Edit
        </button>
        <button className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors">
          <Phone size={16} />
          Assign Responder
        </button>
        {incident.status !== "resolved" && (
          <button className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors">
            <CheckCircle size={16} />
            Mark Resolved
          </button>
        )}
        <button className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors">
          <MapPin size={16} />
          View on Map
        </button>
      </div>
    </div>
  )
}
