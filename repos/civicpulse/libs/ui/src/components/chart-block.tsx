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
  onResize?: (colSpan: 1 | 2 | 3, rowSpan: 1 | 2) => void
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
  onResize,
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

  const handleResize = useCallback(
    (newColSpan: 1 | 2 | 3, newRowSpan: 1 | 2) => {
      onResize?.(newColSpan, newRowSpan)
      setMenuOpen(false)
      setResizeMenuOpen(false)
    },
    [onResize]
  )

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
        "group relative flex flex-col rounded-lg border border-border bg-card transition-all",
        isDragging && "scale-95 opacity-50",
        isMergeTarget && "scale-[1.02] ring-2 ring-accent",
        colSpan === 1 && "col-span-1",
        colSpan === 2 && "col-span-2",
        colSpan === 3 && "col-span-3",
        rowSpan === 1 && "row-span-1",
        rowSpan === 2 && "row-span-2"
      )}
      {...rest}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Drag grip - visible on hover only */}
          {draggable && (
            <div
              className="cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
              {...dragHandleProps}
              aria-label="Drag to reorder"
            >
              <DotsSixVertical size={16} weight="bold" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Expand/fullscreen button */}
          <button
            onClick={onFullscreen}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
            aria-label="Toggle fullscreen"
          >
            <ArrowsOutSimple size={14} />
          </button>

          {/* Kebab menu */}
          <div className="relative" data-chart-block-menu>
            <button
              onClick={handleToggleMenu}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
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
                className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-card p-1 shadow-lg"
              >
                {/* Resize submenu */}
                <div className="relative">
                  <button
                    role="menuitem"
                    onClick={() => setResizeMenuOpen(!resizeMenuOpen)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                    aria-expanded={resizeMenuOpen}
                    aria-haspopup="menu"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowsOut size={14} />
                      Resize
                    </span>
                  </button>

                  {resizeMenuOpen && (
                    <div
                      role="menu"
                      className="absolute left-full top-0 ml-1 w-28 rounded-lg border border-border bg-card p-1 shadow-lg"
                    >
                      <button
                        role="menuitem"
                        onClick={() => handleResize(1, rowSpan)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        1 col
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => handleResize(2, rowSpan)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        2 col
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => handleResize(3, rowSpan)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        3 col
                      </button>
                      <div className="my-1 border-t border-border" role="separator" />
                      <button
                        role="menuitem"
                        onClick={() => handleResize(colSpan, 1)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        Short
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => handleResize(colSpan, 2)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        Tall
                      </button>
                    </div>
                  )}
                </div>

                {onMerge && (
                  <button
                    role="menuitem"
                    onClick={handleMerge}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <ArrowsMerge size={14} />
                    Merge
                  </button>
                )}

                {onExport && (
                  <button
                    role="menuitem"
                    onClick={handleExport}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <Export size={14} />
                    Export CSV
                  </button>
                )}

                {onRemove && (
                  <>
                    <div className="my-1 border-t border-border" role="separator" />
                    <button
                      role="menuitem"
                      onClick={handleRemove}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
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
        <div className="flex items-center justify-between border-t border-border px-4 py-2">
          <div className="flex-1">{footer}</div>
          {/* Resize handle indicator */}
          <div
            className="cursor-se-resize text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
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
