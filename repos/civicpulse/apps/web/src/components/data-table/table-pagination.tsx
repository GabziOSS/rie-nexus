"use client"

import type { Table } from "@tanstack/react-table"
import {
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "@phosphor-icons/react"
import type { Incident } from "@rie-civicpulse/mock-data/types"

interface TablePaginationProps {
  table: Table<Incident>
}

export function TablePagination({ table }: TablePaginationProps) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const pageCount = table.getPageCount()
  const rowCount = table.getFilteredRowModel().rows.length

  return (
    <div className="border-border bg-card flex items-center justify-between rounded-lg border px-4 py-3">
      <div className="text-muted-foreground text-sm">
        Showing{" "}
        <span className="font-medium">
          {pageIndex * pageSize + 1}-
          {Math.min((pageIndex + 1) * pageSize, rowCount)}
        </span>{" "}
        of <span className="font-medium">{rowCount}</span> incidents
      </div>

      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            table.setPageSize(Number(e.target.value))
          }}
          className="border-border bg-card rounded-lg border px-2 py-1.5 text-sm"
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center justify-center rounded-lg border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CaretDoubleLeft size={16} />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center justify-center rounded-lg border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CaretLeft size={16} />
          </button>

          <div className="flex items-center gap-1 px-2">
            <span className="text-sm font-medium">
              {pageIndex + 1} of {pageCount}
            </span>
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center justify-center rounded-lg border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CaretRight size={16} />
          </button>
          <button
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex items-center justify-center rounded-lg border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CaretDoubleRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
