import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import type { ChartType } from "@/lib/dashboard-blocks"
import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar"
import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { AddBlockDrawer } from "@/components/dashboard/add-block-drawer"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
})

function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleAddBlock = (_type: ChartType) => {
    // TODO: Dispatch ADD action to grid reducer through context or props
    // This will be wired through a context provider or passed via props
  }

  const handleResetLayout = () => {
    // TODO: Dispatch RESET action to grid reducer
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <DashboardToolbar
        onAddBlock={() => setDrawerOpen(true)}
        onResetLayout={handleResetLayout}
        onTimeRangeChange={() => {}}
        onFilterChange={() => {}}
      />
      <div className="flex-1 overflow-auto">
        <DashboardGrid />
      </div>
      <AddBlockDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSelect={handleAddBlock}
      />
    </div>
  )
}
