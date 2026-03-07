import { createColumnHelper } from "@tanstack/react-table"
import type { CellContext, HeaderContext } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  Flame,
  Waves,
  Warning,
  Heart,
  Wrench,
  Cloud,
  CaretUp,
  CaretDown,
} from "@phosphor-icons/react"
import type { Incident } from "@rie-civicpulse/mock-data/types"
import { RiskBadge } from "@rie-civicpulse/ui/components/risk-badge"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import { ZONES } from "@rie-civicpulse/mock-data"

const columnHelper = createColumnHelper<Incident>()

const INCIDENT_TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  fire: {
    icon: <Flame size={16} weight="fill" />,
    label: "Fire",
    color: "text-destructive",
  },
  flood: {
    icon: <Waves size={16} weight="fill" />,
    label: "Flood",
    color: "text-primary",
  },
  crime: {
    icon: <Warning size={16} weight="fill" />,
    label: "Crime",
    color: "text-accent",
  },
  medical: {
    icon: <Heart size={16} weight="fill" />,
    label: "Medical",
    color: "text-green-500",
  },
  infrastructure: {
    icon: <Wrench size={16} weight="fill" />,
    label: "Infrastructure",
    color: "text-violet-500",
  },
  weather: {
    icon: <Cloud size={16} weight="fill" />,
    label: "Weather",
    color: "text-cyan-500",
  },
}

function IncidentTypeBadge({ type }: { type: string }) {
  const config = INCIDENT_TYPE_CONFIG[type] || INCIDENT_TYPE_CONFIG.fire
  return (
    <div className={cn("inline-flex items-center gap-1.5", config.color)}>
      {config.icon}
      <span className="text-xs font-medium">{config.label}</span>
    </div>
  )
}

function formatDuration(start: string, end: string | null): string {
  if (!end) return "—"
  const startDate = new Date(start)
  const endDate = new Date(end)
  const minutes = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60)
  )
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function getZoneName(zoneId: string): string {
  const zone = ZONES.find((z) => z.id === zoneId)
  return zone?.name || zoneId
}

export const incidentColumns = [
  columnHelper.display({
    id: "expand",
    header: ({ table }: HeaderContext<Incident, unknown>) => (
      <button
        onClick={table.getToggleAllRowsExpandedHandler()}
        className="inline-flex items-center justify-center"
      >
        {table.getIsAllRowsExpanded() ? (
          <CaretUp size={16} />
        ) : (
          <CaretDown size={16} />
        )}
      </button>
    ),
    cell: ({ row }: CellContext<Incident, unknown>) => (
      <button
        onClick={row.getToggleExpandedHandler()}
        className="inline-flex items-center justify-center"
      >
        {row.getIsExpanded() ? <CaretUp size={16} /> : <CaretDown size={16} />}
      </button>
    ),
    size: 40,
  }),

  columnHelper.accessor("id", {
    header: "ID",
    cell: (info: CellContext<Incident, string>) => (
      <code className="text-muted-foreground font-mono text-xs">
        {info.getValue().slice(0, 8)}
      </code>
    ),
    size: 100,
  }),

  columnHelper.accessor("type", {
    header: "Type",
    cell: (info: CellContext<Incident, string>) => (
      <IncidentTypeBadge type={info.getValue()} />
    ),
    size: 120,
  }),

  columnHelper.accessor("severity", {
    header: "Severity",
    cell: (info: CellContext<Incident, string>) => (
      <RiskBadge level={info.getValue()} size="sm" pulse={true} />
    ),
    size: 110,
  }),

  columnHelper.accessor("zoneId", {
    header: "Zone",
    cell: (info: CellContext<Incident, string>) => (
      <span className="text-sm font-medium">
        {getZoneName(info.getValue())}
      </span>
    ),
    size: 100,
  }),

  columnHelper.accessor("location", {
    header: "Barangay",
    cell: (info: CellContext<Incident, { address: string }>) => (
      <span className="text-muted-foreground text-sm">
        {info.getValue().address}
      </span>
    ),
    size: 150,
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: (info: CellContext<Incident, string>) => {
      const status = info.getValue()
      return (
        <RiskBadge
          level={
            status === "reported" || status === "investigating"
              ? "open"
              : status === "resolved"
                ? "in_progress"
                : "resolved"
          }
          size="sm"
          pulse={status === "reported" || status === "investigating"}
        />
      )
    },
    size: 110,
  }),

  columnHelper.accessor("reportedAt", {
    header: "Reported",
    cell: (info: CellContext<Incident, string>) => (
      <span className="text-muted-foreground text-sm">
        {format(new Date(info.getValue()), "MMM d, yyyy HH:mm")}
      </span>
    ),
    size: 160,
  }),

  columnHelper.accessor("assignedTo", {
    header: "Assigned",
    cell: (info: CellContext<Incident, string | null>) => {
      const assigned = info.getValue()
      return (
        <span className="font-tabular-nums text-muted-foreground text-sm">
          {assigned ? "1" : "—"}
        </span>
      )
    },
    size: 80,
  }),

  columnHelper.display({
    id: "duration",
    header: "Duration",
    cell: ({ row }: CellContext<Incident, unknown>) => (
      <span className="text-muted-foreground text-sm">
        {formatDuration(row.original.reportedAt, row.original.resolvedAt)}
      </span>
    ),
    size: 100,
  }),
]
