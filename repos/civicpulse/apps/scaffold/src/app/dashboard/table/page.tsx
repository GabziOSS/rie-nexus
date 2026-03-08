"use client"

import { AppShell } from "@rie-civicpulse/ui/components/app-shell"
import {
  DataTable,
  type IncidentRow,
} from "@rie-civicpulse/ui/components/data-table"
import { INCIDENTS, ZONES } from "@rie-civicpulse/mock-data"

export default function TablePage() {
  const zoneMap = new Map(ZONES.map((z) => [z.id, z.name]))

  const statusMap: Record<string, "open" | "in_progress" | "resolved"> = {
    reported: "open",
    investigating: "in_progress",
    resolved: "resolved",
    closed: "resolved",
  }

  const data: IncidentRow[] = INCIDENTS.map((incident) => ({
    id: incident.id,
    type: incident.type as any,
    status: statusMap[incident.status] || "open",
    severity: incident.severity as any,
    location: incident.location.address,
    barangay: zoneMap.get(incident.zoneId) || "Unknown",
    reportedAt: new Date(incident.reportedAt).toLocaleDateString(),
    respondersAssigned: 0,
    description: incident.description,
  }))

  return (
    <AppShell currentPath="/dashboard">
      <div className="flex h-full flex-col gap-4 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold">Incident Records</h2>
          <p className="text-muted-foreground text-sm">
            All logged incidents — Calbayog City, Samar
          </p>
        </div>
        <DataTable data={data} />
      </div>
    </AppShell>
  )
}
