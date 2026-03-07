/**
 * ChartBlock — Wrapper shell for all dashboard chart components.
 * Provides header with title/actions, chart area, and optional footer.
 */

import { useState } from "react"
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
  children: React.ReactNode
  footer?: React.ReactNode
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
  /** Show drag grip — true when inside sortable grid */
  draggable?: boolean
  isDragging?: boolean
  /** Highlight as merge drop target */
  isMergeTarget?: boolean
  onResize?: (colSpan: 1 | 2 | 3, rowSpan: 1 | 2) => void
  onRemove?: () => void
  onExport?: () => void
  onMerge?: () => void
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
  onResize,
  onRemove,
  onExport,
  onMerge,
}: ChartBlockProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [resizeMenuOpen, setResizeMenuOpen] = useState(false)

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
    >
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Drag grip - visible on hover only */}
          {draggable && (
            <div className="text-muted-foreground cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
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
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-7 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100"
            aria-label="Toggle fullscreen"
          >
            <ArrowsOutSimple size={14} />
          </button>

          {/* Kebab menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-7 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100"
              aria-label="Chart options"
            >
              <DotsThreeVertical size={14} weight="bold" />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div
                className="border-border bg-card absolute top-full right-0 z-50 mt-1 w-36 rounded-lg border p-1 shadow-lg"
                onMouseLeave={() => {
                  setMenuOpen(false)
                  setResizeMenuOpen(false)
                }}
              >
                {/* Resize submenu */}
                <div className="relative">
                  <button
                    onClick={() => setResizeMenuOpen(!resizeMenuOpen)}
                    className="text-foreground hover:bg-muted flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowsOut size={14} />
                      Resize
                    </span>
                  </button>

                  {resizeMenuOpen && (
                    <div className="border-border bg-card absolute top-0 left-full ml-1 w-28 rounded-lg border p-1 shadow-lg">
                      <button
                        onClick={() => {
                          onResize?.(1, 1)
                          setMenuOpen(false)
                        }}
                        className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                      >
                        1 col
                      </button>
                      <button
                        onClick={() => {
                          onResize?.(2, 1)
                          setMenuOpen(false)
                        }}
                        className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                      >
                        2 col
                      </button>
                      <button
                        onClick={() => {
                          onResize?.(3, 1)
                          setMenuOpen(false)
                        }}
                        className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                      >
                        3 col
                      </button>
                      <div className="border-border my-1 border-t" />
                      <button
                        onClick={() => {
                          onResize?.(colSpan, 1)
                          setMenuOpen(false)
                        }}
                        className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                      >
                        Short
                      </button>
                      <button
                        onClick={() => {
                          onResize?.(colSpan, 2)
                          setMenuOpen(false)
                        }}
                        className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                      >
                        Tall
                      </button>
                    </div>
                  )}
                </div>

                {onMerge && (
                  <button
                    onClick={() => {
                      onMerge()
                      setMenuOpen(false)
                    }}
                    className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                  >
                    <ArrowsMerge size={14} />
                    Merge
                  </button>
                )}

                {onExport && (
                  <button
                    onClick={() => {
                      onExport()
                      setMenuOpen(false)
                    }}
                    className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                  >
                    <Export size={14} />
                    Export CSV
                  </button>
                )}

                {onRemove && (
                  <>
                    <div className="border-border my-1 border-t" />
                    <button
                      onClick={() => {
                        onRemove()
                        setMenuOpen(false)
                      }}
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
          {/* Resize handle */}
          <div className="text-muted-foreground cursor-se-resize opacity-0 transition-opacity group-hover:opacity-100">
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
