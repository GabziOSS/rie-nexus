/**
 * Sidebar — Collapsible navigation sidebar for CivicPulse dashboard.
 * Two states: full (240px) and icon-only (56px).
 * Persists collapsed state to localStorage key `civicpulse_sidebar`.
 */

import { useState, useEffect } from "react"
import {
  ChartPieSlice,
  MapTrifold,
  Bell,
  Users,
  Gear,
  CaretLeft,
  CaretRight,
  User,
} from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

// TODO: wire sidebarCollapsedAtom from atoms/ui.atoms.ts
// TODO: wire activeRouteAtom from atoms/ui.atoms.ts

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  disabled?: boolean
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <ChartPieSlice size={20} weight="duotone" /> },
  { label: "Map", path: "/map", icon: <MapTrifold size={20} weight="duotone" /> },
  { label: "Alerts", path: "/alerts", icon: <Bell size={20} weight="duotone" />, disabled: true },
  { label: "Users", path: "/users", icon: <Users size={20} weight="duotone" />, disabled: true },
  { label: "Settings", path: "/settings", icon: <Gear size={20} weight="duotone" />, disabled: true },
]

export interface SidebarProps {
  /** Current route path — used for active state */
  currentPath?: string
  /** Slot for ThemeSwitcher component */
  themeSwitcher?: React.ReactNode
}

function Sidebar({ currentPath = "/dashboard", themeSwitcher }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("civicpulse_sidebar")
    if (stored === "collapsed") {
      setCollapsed(true)
    }
  }, [])

  // Persist collapsed state to localStorage
  const handleToggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem("civicpulse_sidebar", next ? "collapsed" : "expanded")
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Header with logo and collapse toggle */}
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!collapsed && (
          <span className="text-sm font-semibold text-foreground">CivicPulse</span>
        )}
        <button
          onClick={handleToggle}
          className={cn(
            "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <CaretRight size={16} /> : <CaretLeft size={16} />}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + "/")
          const isDisabled = item.disabled

          return (
            <div key={item.path} className="relative group">
              <a
                href={isDisabled ? undefined : item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive && !isDisabled && "border-l-2 border-primary bg-primary/15 text-primary",
                  !isActive && !isDisabled && "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isDisabled && "cursor-not-allowed opacity-40",
                  collapsed && "justify-center px-0"
                )}
                onClick={(e) => isDisabled && e.preventDefault()}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </a>

              {/* Tooltip on hover when collapsed */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-card px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {item.label}
                  {isDisabled && <span className="ml-1 text-muted-foreground">(Coming soon)</span>}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom section - User chip and Theme Switcher */}
      <div className="border-t border-border p-2">
        {/* Theme Switcher slot */}
        {themeSwitcher && <div className="mb-2">{themeSwitcher}</div>}

        {/* User avatar chip */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-md bg-muted/50 px-3 py-2",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
            <User size={16} weight="fill" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Operator</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
export default Sidebar
