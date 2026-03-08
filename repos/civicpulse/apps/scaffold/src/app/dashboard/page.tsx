"use client"

import { useState, useReducer } from "react"
import { AppShell } from "@rie-civicpulse/ui/components/app-shell"
import { DashboardToolbar } from "@rie-civicpulse/ui/components/dashboard-toolbar"
import { DashboardGrid } from "@rie-civicpulse/ui/components/dashboard-grid"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@rie-civicpulse/ui/components/primitives/tabs"
import {
  blocksReducer,
  type ChartBlock,
} from "@rie-civicpulse/ui/lib/dashboard-blocks"
import {
  OVERVIEW_BLOCKS,
  STATION_BLOCKS,
} from "@rie-civicpulse/ui/lib/default-blocks"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "station">("overview")

  // Initialize blocks for each preset
  const overviewInitial = OVERVIEW_BLOCKS.map((b, i) => ({
    ...b,
    id: `block-overview-${i}`,
  }))
  const stationInitial = STATION_BLOCKS.map((b, i) => ({
    ...b,
    id: `block-station-${i}`,
  }))

  const [overviewBlocks, overviewDispatch] = useReducer(
    blocksReducer,
    overviewInitial
  )
  const [stationBlocks, stationDispatch] = useReducer(
    blocksReducer,
    stationInitial
  )

  // Select active state based on tab
  const blocks = activeTab === "overview" ? overviewBlocks : stationBlocks
  const dispatch = activeTab === "overview" ? overviewDispatch : stationDispatch

  return (
    <AppShell currentPath="/dashboard">
      <div className="flex h-full flex-col">
        {/* Tab strip */}
        <div className="border-border border-b px-6 pt-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              if (v === "overview" || v === "station") {
                setActiveTab(v)
              }
            }}
          >
            <TabsList className="gap-4 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-0 pb-3"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="station"
                className="text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-0 pb-3"
              >
                Station View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Toolbar */}
        <DashboardToolbar
          preset={activeTab}
          onReset={() => dispatch({ type: "RESET", preset: activeTab })}
          onAddBlock={(block) => dispatch({ type: "ADD", block })}
        />

        {/* Grid */}
        <div className="flex-1 overflow-auto">
          <DashboardGrid
            preset={activeTab}
            blocks={blocks}
            dispatch={dispatch}
          />
        </div>
      </div>
    </AppShell>
  )
}
