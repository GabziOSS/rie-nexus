import { createFileRoute } from "@tanstack/react-router"
import { IncidentTable } from "@/components/data-table/incident-table"

export const Route = createFileRoute("/dashboard/table")({
  component: () => (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">Incident Records</h2>
        <p className="text-muted-foreground text-sm">
          All logged incidents — filter, sort, and export
        </p>
      </div>
      <IncidentTable />
    </div>
  ),
})
