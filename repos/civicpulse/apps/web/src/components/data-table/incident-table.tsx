"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell,
} from "@tanstack/react-table"
import { INCIDENTS, ZONES } from "@rie-civicpulse/mock-data"
import type { Incident } from "@rie-civicpulse/mock-data/types"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import { incidentColumns } from "./incident-columns"
import { TableToolbar } from "./table-toolbar"
import { TableFilters } from "./table-filters"
import { RowDetailPanel } from "./row-detail-panel"
import { TablePagination } from "./table-pagination"

export function IncidentTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [expanded, setExpanded] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [timeRange, setTimeRange] = useState<{
    from: Date | null
    to: Date | null
  }>({ from: null, to: null })
  const [activeTypes, setActiveTypes] = useState<string[]>([])
  const [activeSeverities, setActiveSeverities] = useState<string[]>([])
  const [activeStatuses, setActiveStatuses] = useState<string[]>([])
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [responderRange, setResponderRange] = useState<{
    min: number
    max: number
  }>({ min: 0, max: 10 })

  const filteredData = useMemo(() => {
    return INCIDENTS.filter((incident) => {
      // Time range filter
      if (timeRange.from || timeRange.to) {
        const incidentDate = new Date(incident.reportedAt)
        if (timeRange.from && incidentDate < timeRange.from) return false
        if (timeRange.to && incidentDate > timeRange.to) return false
      }

      // Type filter
      if (activeTypes.length > 0 && !activeTypes.includes(incident.type)) {
        return false
      }

      // Severity filter
      if (
        activeSeverities.length > 0 &&
        !activeSeverities.includes(incident.severity)
      ) {
        return false
      }

      // Status filter
      if (
        activeStatuses.length > 0 &&
        !activeStatuses.includes(incident.status)
      ) {
        return false
      }

      // Zone filter
      if (
        selectedZones.length > 0 &&
        !selectedZones.includes(incident.zoneId)
      ) {
        return false
      }

      // Responder filter
      const responderCount = incident.assignedTo ? 1 : 0
      if (
        responderCount < responderRange.min ||
        responderCount > responderRange.max
      ) {
        return false
      }

      // Global search filter
      if (globalFilter) {
        const searchLower = globalFilter.toLowerCase()
        return (
          incident.id.toLowerCase().includes(searchLower) ||
          incident.type.toLowerCase().includes(searchLower) ||
          incident.description.toLowerCase().includes(searchLower) ||
          incident.location.address.toLowerCase().includes(searchLower) ||
          ZONES.find((z) => z.id === incident.zoneId)
            ?.name.toLowerCase()
            .includes(searchLower)
        )
      }

      return true
    })
  }, [
    timeRange,
    activeTypes,
    activeSeverities,
    activeStatuses,
    selectedZones,
    responderRange,
    globalFilter,
  ])

  const table = useReactTable({
    data: filteredData,
    columns: incidentColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  })

  return (
    <div className="flex h-full flex-col gap-4">
      <TableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        table={table}
        activeTypes={activeTypes}
        onActiveTypesChange={setActiveTypes}
        activeSeverities={activeSeverities}
        onActiveSeveritiesChange={setActiveSeverities}
        activeStatuses={activeStatuses}
        onActiveStatusesChange={setActiveStatuses}
      />

      <TableFilters
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedZones={selectedZones}
        onSelectedZonesChange={setSelectedZones}
        responderRange={responderRange}
        onResponderRangeChange={setResponderRange}
      />

      <div className="border-border flex-1 overflow-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-card sticky top-0 z-10">
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<Incident>) => (
                <tr key={headerGroup.id} className="border-border border-b">
                  {headerGroup.headers.map(
                    (header: Header<Incident, unknown>) => (
                      <th
                        key={header.id}
                        className="text-foreground px-4 py-3 text-left text-xs font-semibold"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            onClick={header.column.getToggleSortingHandler()}
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }
                          >
                            {header.getContext().renderHeader()}
                            {header.column.getIsSorted() && (
                              <span className="ml-1">
                                {header.column.getIsSorted() === "desc"
                                  ? "↓"
                                  : "↑"}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    )
                  )}
                </tr>
              ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.flatMap((row: Row<Incident>, idx: number) => [
                <tr
                  key={row.id}
                  className={cn(
                    "border-border hover:bg-muted/30 border-b transition-colors",
                    idx % 2 === 0 ? "bg-card" : "bg-card/50"
                  )}
                >
                  {row
                    .getVisibleCells()
                    .map((cell: Cell<Incident, unknown>) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3"
                        style={{ width: cell.column.getSize() }}
                      >
                        {cell.getContext().renderCell()}
                      </td>
                    ))}
                </tr>,
                row.getIsExpanded() && (
                  <tr key={`${row.id}-detail`}>
                    <td colSpan={incidentColumns.length} className="p-0">
                      <RowDetailPanel incident={row.original} />
                    </td>
                  </tr>
                ),
              ])}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={incidentColumns.length}
                  className="text-muted-foreground px-4 py-8 text-center text-sm"
                >
                  No incidents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination table={table} />
    </div>
  )
}
