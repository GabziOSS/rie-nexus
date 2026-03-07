"use client"

/**
 * DataTable
 * Main data table container for displaying incident records.
 * Visual implementation only — no TanStack Table wiring.
 * Displays columns: checkbox, id, type, status, severity, location, barangay, reported, responders.
 * Supports sort indicators and row click expansion.
 */

import { memo, useState, useCallback } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import {
  CaretUp,
  CaretDown,
  CaretUpDown,
  CheckSquare,
  Square,
} from "@phosphor-icons/react"
import { RiskBadge, type RiskLevel, type IncidentStatus } from "../risk-badge"
import {
  IncidentTypeBadge,
  type IncidentType,
} from "../incident-type-badge"

// TODO: wire TanStack Table for sorting, filtering, pagination

export interface IncidentRow {
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

export type SortDirection = "asc" | "desc" | null
export type SortableColumn =
  | "id"
  | "type"
  | "status"
  | "severity"
  | "reportedAt"
  | "respondersAssigned"

export interface DataTableProps {
  data?: IncidentRow[]
  /** Currently expanded row ID */
  expandedRowId?: string | null
  onRowClick?: (row: IncidentRow) => void
  /** Selected row IDs */
  selectedIds?: string[]
  onSelectChange?: (ids: string[]) => void
  /** Current sort column */
  sortColumn?: SortableColumn | null
  sortDirection?: SortDirection
  onSort?: (column: SortableColumn) => void
  className?: string
}

// Column headers configuration
const COLUMNS = [
  { key: "checkbox", label: "", width: "w-10", sortable: false },
  { key: "id", label: "ID", width: "w-20", sortable: true },
  { key: "type", label: "Type", width: "w-32", sortable: true },
  { key: "status", label: "Status", width: "w-28", sortable: true },
  { key: "severity", label: "Severity", width: "w-24", sortable: true },
  { key: "location", label: "Location", width: "flex-1", sortable: false },
  { key: "barangay", label: "Barangay", width: "w-32", sortable: false },
  { key: "reportedAt", label: "Reported", width: "w-28", sortable: true },
  {
    key: "respondersAssigned",
    label: "Resp.",
    width: "w-16",
    sortable: true,
  },
] as const

// Sort indicator component
function SortIndicator({
  column,
  sortColumn,
  sortDirection,
}: {
  column: string
  sortColumn?: SortableColumn | null
  sortDirection?: SortDirection
}) {
  if (sortColumn === column) {
    if (sortDirection === "asc") {
      return <CaretUp size={12} weight="bold" className="text-primary" />
    }
    if (sortDirection === "desc") {
      return <CaretDown size={12} weight="bold" className="text-primary" />
    }
  }
  return <CaretUpDown size={12} className="text-muted-foreground/50" />
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function DataTableComponent({
  data,
  expandedRowId,
  onRowClick,
  selectedIds = [],
  onSelectChange,
  sortColumn,
  sortDirection,
  onSort,
  className,
}: DataTableProps) {
  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (!data || !onSelectChange) return
    if (selectedIds.length === data.length) {
      onSelectChange([])
    } else {
      onSelectChange(data.map((r) => r.id))
    }
  }, [data, selectedIds, onSelectChange])

  // Handle individual selection
  const handleSelect = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation()
      if (!onSelectChange) return
      if (selectedIds.includes(id)) {
        onSelectChange(selectedIds.filter((i) => i !== id))
      } else {
        onSelectChange([...selectedIds, id])
      }
    },
    [selectedIds, onSelectChange]
  )

  // Loading state
  if (!data) {
    return (
      <div
        className={cn(
          "h-full w-full animate-pulse rounded-lg bg-muted/30",
          className
        )}
      />
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center text-muted-foreground",
          className
        )}
      >
        No incidents found
      </div>
    )
  }

  const allSelected = selectedIds.length === data.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length

  return (
    <div className={cn("w-full overflow-auto rounded-lg border border-border", className)}>
      <table className="w-full min-w-[800px] text-sm">
        {/* Header */}
        <thead className="border-b border-border bg-muted/30">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 py-3 text-left font-medium text-muted-foreground",
                  col.width,
                  col.sortable && "cursor-pointer select-none hover:text-foreground"
                )}
                onClick={
                  col.sortable && onSort
                    ? () => onSort(col.key as SortableColumn)
                    : undefined
                }
              >
                {col.key === "checkbox" ? (
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                    aria-label={allSelected ? "Deselect all" : "Select all"}
                  >
                    {allSelected ? (
                      <CheckSquare size={16} weight="fill" className="text-primary" />
                    ) : someSelected ? (
                      <CheckSquare size={16} weight="duotone" className="text-primary" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                ) : (
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <SortIndicator
                        column={col.key}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    )}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-border">
          {data.map((row) => {
            const isExpanded = expandedRowId === row.id
            const isSelected = selectedIds.includes(row.id)

            return (
              <tr
                key={row.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/20",
                  isExpanded && "bg-muted/30",
                  isSelected && "bg-primary/5"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {/* Checkbox */}
                <td className="px-3 py-3">
                  <button
                    onClick={(e) => handleSelect(row.id, e)}
                    className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                    aria-label={isSelected ? `Deselect ${row.id}` : `Select ${row.id}`}
                  >
                    {isSelected ? (
                      <CheckSquare size={16} weight="fill" className="text-primary" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </td>

                {/* ID */}
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                  {row.id}
                </td>

                {/* Type */}
                <td className="px-3 py-3">
                  <IncidentTypeBadge type={row.type} size="sm" />
                </td>

                {/* Status */}
                <td className="px-3 py-3">
                  <RiskBadge
                    level={row.status}
                    size="sm"
                    pulse={row.status === "open"}
                  />
                </td>

                {/* Severity */}
                <td className="px-3 py-3">
                  <RiskBadge level={row.severity} size="sm" showDot />
                </td>

                {/* Location */}
                <td className="max-w-[200px] truncate px-3 py-3 text-foreground">
                  {row.location}
                </td>

                {/* Barangay */}
                <td className="px-3 py-3 text-muted-foreground">{row.barangay}</td>

                {/* Reported */}
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                  {formatRelativeTime(row.reportedAt)}
                </td>

                {/* Responders */}
                <td className="px-3 py-3 text-center font-mono text-foreground">
                  {row.respondersAssigned}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

DataTableComponent.displayName = "DataTable"

export const DataTable = memo(DataTableComponent)
export default DataTable
