/**
 * Tabs — Minimal headless tabs component.
 * Manages tab state and provides context for TabsList, TabsTrigger, and TabsContent.
 */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type FC,
} from "react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function useTabs() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("useTabs must be used within Tabs")
  }
  return context
}

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
}

const Tabs: FC<TabsProps> = ({ value, onValueChange, children }) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    {children}
  </TabsContext.Provider>
)

interface TabsListProps {
  children: ReactNode
  className?: string
}

const TabsList: FC<TabsListProps> = ({ children, className }) => (
  <div role="tablist" className={cn("flex gap-2", className)}>
    {children}
  </div>
)

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

const TabsTrigger: FC<TabsTriggerProps> = ({ value, children, className }) => {
  const { value: activeValue, onValueChange } = useTabs()
  const isActive = activeValue === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      onClick={() => onValueChange(value)}
      className={cn(
        "px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "text-foreground border-primary border-b-2"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

const TabsContent: FC<TabsContentProps> = ({ value, children, className }) => {
  const { value: activeValue } = useTabs()

  if (activeValue !== value) return null

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      className={cn("w-full", className)}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
