"use client"

/**
 * AppShell — Full-height layout wrapper for CivicPulse dashboard.
 * Composes Sidebar + TopBar + content area.
 * Accepts children for main content and slots for ThemeSwitcher.
 */

import type { ReactNode } from "react"
import { Sidebar, type SidebarProps } from "@rie-civicpulse/ui/components/sidebar"
import { TopBar, type BreadcrumbItem, type TopBarProps } from "@rie-civicpulse/ui/components/top-bar"
import { cn } from "@rie-civicpulse/ui/lib/utils"

// TODO: wire global layout atoms from atoms/ui.atoms.ts

export interface AppShellProps {
  children: ReactNode
  /** Current route path — passed to Sidebar for active state */
  currentPath?: string
  /** Breadcrumb items for TopBar */
  breadcrumbs?: BreadcrumbItem[]
  /** Notification count for TopBar */
  notificationCount?: number
  /** City name displayed in TopBar */
  cityName?: string
  /** Slot for ThemeSwitcher component (passed to Sidebar) */
  themeSwitcher?: ReactNode
  /** Custom className for main content area */
  contentClassName?: string
  /** Sidebar navigation callback */
  onNavigate?: SidebarProps["onNavigate"]
  /** TopBar user menu callbacks */
  onProfile?: TopBarProps["onProfile"]
  onSettings?: TopBarProps["onSettings"]
  onSignOut?: TopBarProps["onSignOut"]
  onNotifications?: TopBarProps["onNotifications"]
}

function AppShell({
  children,
  currentPath = "/dashboard",
  breadcrumbs = [],
  notificationCount = 0,
  cityName,
  themeSwitcher,
  contentClassName,
  onNavigate,
  onProfile,
  onSettings,
  onSignOut,
  onNotifications,
  ...rest
}: AppShellProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex h-screen overflow-hidden bg-background" {...rest}>
      {/* Sidebar */}
      <Sidebar
        currentPath={currentPath}
        themeSwitcher={themeSwitcher}
        onNavigate={onNavigate}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TopBar */}
        <TopBar
          items={breadcrumbs}
          notificationCount={notificationCount}
          cityName={cityName}
          onProfile={onProfile}
          onSettings={onSettings}
          onSignOut={onSignOut}
          onNotifications={onNotifications}
        />

        {/* Content */}
        <main className={cn("flex-1 overflow-auto p-4", contentClassName)}>
          {children}
        </main>
      </div>
    </div>
  )
}

export { AppShell }
export default AppShell
