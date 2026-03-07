"use client"

/**
 * DataTablePagination
 * Page controls + rows-per-page select.
 * Visual only — no TanStack Table wiring.
 */

import { memo, useCallback } from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"
import {
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "@phosphor-icons/react"

// TODO: wire TanStack Table pagination state

export interface DataTablePaginationProps {
  /** Total number of items */
  totalItems?: number
  /** Items per page */
  pageSize?: number
  /** Current page (1-indexed) */
  currentPage?: number
  /** Callback when page changes */
  onPageChange?: (page: number) => void
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void
  className?: string
}

const PAGE_SIZE_OPTIONS = [10, 25, 50]

function DataTablePaginationComponent({
  totalItems = 0,
  pageSize = 25,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
  className,
}: DataTablePaginationProps) {
  // Calculate pagination info
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Handlers
  const handleFirstPage = useCallback(() => {
    onPageChange?.(1)
  }, [onPageChange])

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) onPageChange?.(currentPage - 1)
  }, [currentPage, onPageChange])

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) onPageChange?.(currentPage + 1)
  }, [currentPage, totalPages, onPageChange])

  const handleLastPage = useCallback(() => {
    onPageChange?.(totalPages)
  }, [totalPages, onPageChange])

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onPageSizeChange?.(Number(e.target.value))
    },
    [onPageSizeChange]
  )

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 px-4 py-3 text-sm",
        className
      )}
    >
      {/* Items info */}
      <div className="text-muted-foreground">
        <span className="font-medium text-foreground">{totalItems}</span>
        {" incidents · showing "}
        <span className="font-medium text-foreground">
          {startItem}–{endItem}
        </span>
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to first page"
        >
          <CaretDoubleLeft size={16} />
        </button>

        {/* Previous page */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to previous page"
        >
          <CaretLeft size={16} />
        </button>

        {/* Page indicator */}
        <span className="px-2 text-muted-foreground">
          Page{" "}
          <span className="font-medium text-foreground">{currentPage}</span>
          {" of "}
          <span className="font-medium text-foreground">{totalPages}</span>
        </span>

        {/* Next page */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to next page"
        >
          <CaretRight size={16} />
        </button>

        {/* Last page */}
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to last page"
        >
          <CaretDoubleRight size={16} />
        </button>
      </div>

      {/* Page size select */}
      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Rows per page"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} rows
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

DataTablePaginationComponent.displayName = "DataTablePagination"

export const DataTablePagination = memo(DataTablePaginationComponent)
export default DataTablePagination
