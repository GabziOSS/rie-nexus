import { createFileRoute, Link, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="flex h-screen flex-col">
      {/* Tab strip */}
      <div className="border-border bg-card border-b px-6">
        <nav className="flex gap-6">
          <Link
            to="/dashboard"
            activeProps={{
              className: "border-b-2 border-primary text-foreground",
            }}
            className="text-muted-foreground hover:text-foreground py-3 text-sm font-medium transition-colors"
          >
            Overview
          </Link>
          <Link
            to="/dashboard/table"
            activeProps={{
              className: "border-b-2 border-primary text-foreground",
            }}
            className="text-muted-foreground hover:text-foreground py-3 text-sm font-medium transition-colors"
          >
            Data Table
          </Link>
        </nav>
      </div>
      {/* Page content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
