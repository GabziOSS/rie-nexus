/**
 * Sheet — Minimal side drawer component.
 * Renders a modal overlay with a slide-in panel from the specified side.
 */

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  type FC,
} from "react"
import { X } from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

interface SheetContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = createContext<SheetContextType | undefined>(undefined)

function useSheet() {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error("useSheet must be used within Sheet")
  }
  return context
}

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

const Sheet: FC<SheetProps> = ({ open, onOpenChange, children }) => (
  <SheetContext.Provider value={{ open, onOpenChange }}>
    {children}
  </SheetContext.Provider>
)

interface SheetContentProps {
  side?: "left" | "right"
  children: ReactNode
  className?: string
}

const SheetContent: FC<SheetContentProps> = ({
  side = "right",
  children,
  className,
}) => {
  const { open, onOpenChange } = useSheet()

  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "bg-card fixed top-0 z-50 h-full w-96 shadow-lg transition-transform duration-300",
          side === "right"
            ? "right-0 translate-x-0"
            : "left-0 -translate-x-full",
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-4 right-4 rounded-md p-1"
          aria-label="Close sheet"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="h-full overflow-auto p-6 pt-12">{children}</div>
      </div>
    </>
  )
}

interface SheetHeaderProps {
  children: ReactNode
  className?: string
}

const SheetHeader: FC<SheetHeaderProps> = ({ children, className }) => (
  <div className={cn("mb-6", className)}>{children}</div>
)

interface SheetTitleProps {
  children: ReactNode
  className?: string
}

const SheetTitle: FC<SheetTitleProps> = ({ children, className }) => (
  <h2 className={cn("text-foreground text-lg font-semibold", className)}>
    {children}
  </h2>
)

export { Sheet, SheetContent, SheetHeader, SheetTitle }
