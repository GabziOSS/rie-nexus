"use client"

import { useState, useCallback } from "react"
import type { Table } from "@tanstack/react-table"
import { MagnifyingGlass, Download, Funnel } from "@phosphor-icons/react"
import type { Incident } from "@rie-civicpulse/mock-data/types"
import { cn } from "@rie-civicpulse/ui/lib/utils"

interface TableToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  table: Table<Incident>
  activeTypes: string[]
  onActiveTypesChange: (types: string[]) => void
  activeSeverities: string[]
  onActiveSeveritiesChange: (severities: string[]) => void
  activeStatuses: string[]
  onActiveStatusesChange: (statuses: string[]) => void
}

const INCIDENT_TYPES = [
  { id: "fire", label: "Fire" },
  { id: "flood", label: "Flood" },
  { id: "crime", label: "Crime" },
  { id: "medical", label: "Medical" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "weather", label: "Weather" },
]

const SEVERITY_LEVELS = [
  { id: "critical", label: "Critical" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
]

const INCIDENT_STATUSES = [
  { id: "reported", label: "Reported" },
  { id: "investigating", label: "Investigating" },
  { id: "resolved", label: "Resolved" },
  { id: "closed", label: "Closed" },
]

export function TableToolbar({
  globalFilter,
  onGlobalFilterChange,
  table,
  activeTypes,
  onActiveTypesChange,
  activeSeverities,
  onActiveSeveritiesChange,
  activeStatuses,
  onActiveStatusesChange,
}: TableToolbarProps) {
  const [typeOpen, setTypeOpen] = useState(false)
  const [severityOpen, setSeverityOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [columnOpen, setColumnOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  const handleExportCSV = useCallback(() => {
    const rows = table.getRowModel().rows
    const headers = table.getAllColumns().map((col) => col.id)
    const csv = [
      headers.join(","),
      ...rows.map((row) => {
        return headers
          .map((header: string) => {
            const cell = row.getValue(header)
            return typeof cell === "string" ? `"${cell}"` : cell
          })
          .join(",")
      }),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `incidents-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [table])

  const handleExportJSON = useCallback(() => {
    const rows = table.getRowModel().rows
    const data = rows.map((row) => row.original)
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `incidents-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [table])

  const toggleType = (typeId: string) => {
    onActiveTypesChange(
      activeTypes.includes(typeId)
        ? activeTypes.filter((t) => t !== typeId)
        : [...activeTypes, typeId]
    )
  }

  const toggleSeverity = (severityId: string) => {
    onActiveSeveritiesChange(
      activeSeverities.includes(severityId)
        ? activeSeverities.filter((s) => s !== severityId)
        : [...activeSeverities, severityId]
    )
  }

  const toggleStatus = (statusId: string) => {
    onActiveStatusesChange(
      activeStatuses.includes(statusId)
        ? activeStatuses.filter((s) => s !== statusId)
        : [...activeStatuses, statusId]
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search and export row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search incidents..."
            value={globalFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onGlobalFilterChange(e.target.value)
            }
            className="border-border bg-card placeholder-muted-foreground focus:border-primary w-full rounded-lg border px-3 py-2 pl-9 text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setTypeOpen(!typeOpen)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              activeTypes.length > 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            <Funnel size={16} />
            Type
            {activeTypes.length > 0 && (
              <span className="bg-primary/20 ml-1 rounded-full px-1.5 py-0.5 text-xs font-semibold">
                {activeTypes.length}
              </span>
            )}
          </button>

          {typeOpen && (
            <div className="border-border bg-card absolute top-full mt-1 rounded-lg border p-2 shadow-lg">
              {INCIDENT_TYPES.map((type) => (
                <label
                  key={type.id}
                  className="hover:bg-muted/50 flex items-center gap-2 px-2 py-1.5 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={activeTypes.includes(type.id)}
                    onChange={() => toggleType(type.id)}
                    className="rounded"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          )}

          <button
            onClick={() => setSeverityOpen(!severityOpen)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              activeSeverities.length > 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            <Funnel size={16} />
            Severity
            {activeSeverities.length > 0 && (
              <span className="bg-primary/20 ml-1 rounded-full px-1.5 py-0.5 text-xs font-semibold">
                {activeSeverities.length}
              </span>
            )}
          </button>

          {severityOpen && (
            <div className="border-border bg-card absolute top-full mt-1 rounded-lg border p-2 shadow-lg">
              {SEVERITY_LEVELS.map((severity) => (
                <label
                  key={severity.id}
                  className="hover:bg-muted/50 flex items-center gap-2 px-2 py-1.5 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={activeSeverities.includes(severity.id)}
                    onChange={() => toggleSeverity(severity.id)}
                    className="rounded"
                  />
                  {severity.label}
                </label>
              ))}
            </div>
          )}

          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              activeStatuses.length > 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            <Funnel size={16} />
            Status
            {activeStatuses.length > 0 && (
              <span className="bg-primary/20 ml-1 rounded-full px-1.5 py-0.5 text-xs font-semibold">
                {activeStatuses.length}
              </span>
            )}
          </button>

          {statusOpen && (
            <div className="border-border bg-card absolute top-full mt-1 rounded-lg border p-2 shadow-lg">
              {INCIDENT_STATUSES.map((status) => (
                <label
                  key={status.id}
                  className="hover:bg-muted/50 flex items-center gap-2 px-2 py-1.5 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={activeStatuses.includes(status.id)}
                    onChange={() => toggleStatus(status.id)}
                    className="rounded"
                  />
                  {status.label}
                </label>
              ))}
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setColumnOpen(!columnOpen)}
              className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
            >
              Columns
            </button>

            {columnOpen && (
              <div className="border-border bg-card absolute top-full right-0 mt-1 rounded-lg border p-2 shadow-lg">
                {table.getAllColumns().map((column) => (
                  <label
                    key={column.id}
                    className="hover:bg-muted/50 flex items-center gap-2 px-2 py-1.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        column.toggleVisibility(e.target.checked)
                      }}
                      className="rounded"
                    />
                    {column.columnDef.header}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
            >
              <Download size={16} />
              Export
            </button>

            {exportOpen && (
              <div className="border-border bg-card absolute top-full right-0 mt-1 rounded-lg border shadow-lg">
                <button
                  onClick={handleExportCSV}
                  className="hover:bg-muted/50 block w-full px-4 py-2 text-left text-sm"
                >
                  CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className="hover:bg-muted/50 block w-full px-4 py-2 text-left text-sm"
                >
                  JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
