/**
 * AppShell — Full-height layout wrapper for CivicPulse dashboard.
 * Composes Sidebar + TopBar + content area.
 */

import { Sidebar, type SidebarProps } from "@rie-civicpulse/ui/components/sidebar"
import { TopBar, type BreadcrumbItem } from "@rie-civicpulse/ui/components/top-bar"

export interface AppShellProps {
  children: React.ReactNode
  /** Current route path — passed to Sidebar for active state */
  currentPath?: string
  /** Breadcrumb items for TopBar */
  breadcrumbs?: BreadcrumbItem[]
  /** Notification count for TopBar */
  notificationCount?: number
  /** Slot for ThemeSwitcher component (passed to Sidebar) */
  themeSwitcher?: React.ReactNode
}

function AppShell({
  children,
  currentPath = "/dashboard",
  breadcrumbs = [],
  notificationCount = 0,
  themeSwitcher,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        currentPath={currentPath}
        themeSwitcher={themeSwitcher}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TopBar */}
        <TopBar
          items={breadcrumbs}
          notificationCount={notificationCount}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

export { AppShell }
export default AppShell
