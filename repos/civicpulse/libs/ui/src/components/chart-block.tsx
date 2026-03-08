"use client"

/**
 * ChartBlock — Wrapper shell for all dashboard chart components.
 * Provides header with title/actions, chart area, and optional footer.
 * Supports drag handle, resize menu, and kebab menu actions.
 */

import { useState, useCallback, useEffect, type ReactNode } from "react"
import {
  DotsSixVertical,
  ArrowsOutSimple,
  DotsThreeVertical,
  ArrowsOut,
  Export,
  Trash,
  ArrowsMerge,
} from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

// TODO: wire to dashboardBlocksAtom from atoms/dashboard.atoms.ts

export interface ChartBlockProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
  /** Show drag grip — true when inside sortable grid */
  draggable?: boolean
  isDragging?: boolean
  /** Highlight as merge drop target */
  isMergeTarget?: boolean
  /** Drag handle props for dnd-kit integration */
  dragHandleProps?: Record<string, unknown>
  dragListeners?: Record<string, unknown>
  dragAttributes?: Record<string, unknown>
  onColSpanChange?: (colSpan: 1 | 2 | 3) => void
  onRemove?: () => void
  onExport?: () => void
  onMerge?: () => void
  onFullscreen?: () => void
}

function ChartBlock({
  title,
  subtitle,
  children,
  footer,
  colSpan = 1,
  rowSpan = 1,
  draggable = false,
  isDragging = false,
  isMergeTarget = false,
  dragHandleProps,
  dragListeners,
  dragAttributes,
  onColSpanChange,
  onRemove,
  onExport,
  onMerge,
  onFullscreen,
  ...rest
}: ChartBlockProps & Omit<React.HTMLAttributes<HTMLDivElement>, "title">) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [resizeMenuOpen, setResizeMenuOpen] = useState(false)

  // Close menus when clicking outside
  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-chart-block-menu]")) {
        setMenuOpen(false)
        setResizeMenuOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [menuOpen])

  // Handlers with useCallback for stable identity
  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev)
  }, [])

  const handleColSpanChange = useCallback(
    (newColSpan: 1 | 2 | 3) => {
      onColSpanChange?.(newColSpan)
      setMenuOpen(false)
      setResizeMenuOpen(false)
    },
    [onColSpanChange]
  )

  const cycleColSpan = useCallback(() => {
    const nextColSpan: 1 | 2 | 3 = colSpan === 1 ? 2 : colSpan === 2 ? 3 : 1
    handleColSpanChange(nextColSpan)
  }, [colSpan, handleColSpanChange])

  const handleRemove = useCallback(() => {
    onRemove?.()
    setMenuOpen(false)
  }, [onRemove])

  const handleExport = useCallback(() => {
    onExport?.()
    setMenuOpen(false)
  }, [onExport])

  const handleMerge = useCallback(() => {
    onMerge?.()
    setMenuOpen(false)
  }, [onMerge])

  return (
    <div
      className={cn(
        "group border-border bg-card relative flex flex-col rounded-lg border transition-all",
        isDragging && "scale-95 opacity-50",
        isMergeTarget && "ring-accent scale-[1.02] ring-2",
        colSpan === 1 && "col-span-1",
        colSpan === 2 && "col-span-2",
        colSpan === 3 && "col-span-3",
        rowSpan === 1 && "row-span-1",
        rowSpan === 2 && "row-span-2"
      )}
      {...rest}
    >
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Drag grip - visible on hover only */}
          {draggable && (
            <div
              className="text-muted-foreground cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
              {...dragListeners}
              {...dragAttributes}
              aria-label="Drag to reorder"
            >
              <DotsSixVertical size={16} weight="bold" />
            </div>
          )}
          <div>
            <h3 className="text-foreground text-sm font-medium">{title}</h3>
            {subtitle && (
              <p className="text-muted-foreground text-xs">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Expand/fullscreen button */}
          <button
            onClick={onFullscreen}
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-7 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100"
            aria-label="Toggle fullscreen"
          >
            <ArrowsOutSimple size={14} />
          </button>

          {/* Kebab menu */}
          <div className="relative" data-chart-block-menu>
            <button
              onClick={handleToggleMenu}
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-7 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100"
              aria-label="Chart options"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <DotsThreeVertical size={14} weight="bold" />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div
                role="menu"
                className="border-border bg-card absolute top-full right-0 z-50 mt-1 w-36 rounded-lg border p-1 shadow-lg"
              >
                {/* Resize button — cycles colSpan: 1 → 2 → 3 → 1 */}
                <button
                  role="menuitem"
                  onClick={cycleColSpan}
                  className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                >
                  <ArrowsOut size={14} />
                  Resize ({colSpan} col)
                </button>

                {onMerge && (
                  <button
                    role="menuitem"
                    onClick={handleMerge}
                    className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                  >
                    <ArrowsMerge size={14} />
                    Merge
                  </button>
                )}

                {onExport && (
                  <button
                    role="menuitem"
                    onClick={handleExport}
                    className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                  >
                    <Export size={14} />
                    Export CSV
                  </button>
                )}

                {onRemove && (
                  <>
                    <div
                      className="border-border my-1 border-t"
                      role="separator"
                    />
                    <button
                      role="menuitem"
                      onClick={handleRemove}
                      className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                    >
                      <Trash size={14} />
                      Remove
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 p-4">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="border-border flex items-center justify-between border-t px-4 py-2">
          <div className="flex-1">{footer}</div>
          {/* Resize handle indicator */}
          <div
            className="text-muted-foreground cursor-se-resize opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="stroke-current"
            >
              <path d="M10 2L2 10" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 6L6 10" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 10L10 10" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export { ChartBlock }
export default ChartBlock
