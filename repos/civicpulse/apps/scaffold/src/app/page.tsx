"use client"

import { useState } from "react"
import { Warning, Users, Clock, MapPin } from "@phosphor-icons/react"
import { AppShell } from "@rie-civicpulse/ui/components/app-shell"
import { ThemeSwitcher } from "@rie-civicpulse/ui/components/theme-switcher"
import { StatCardFull } from "@rie-civicpulse/ui/components/stat-card-full"
import { ChartBlock } from "@rie-civicpulse/ui/components/chart-block"
import { RiskBadge } from "@rie-civicpulse/ui/components/risk-badge"
import { IncidentTypeBadge } from "@rie-civicpulse/ui/components/incident-type-badge"
import { ZoneSheet } from "@rie-civicpulse/ui/components/zone-sheet"

export default function DashboardPage() {
  const [currentPath, setCurrentPath] = useState("/dashboard")
  const [zoneSheetOpen, setZoneSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "timeline" | "log">("details")

  return (
    <AppShell
      currentPath={currentPath}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Overview" },
      ]}
      notificationCount={3}
      themeSwitcher={<ThemeSwitcher />}
      onNavigate={setCurrentPath}
    >
      {/* Hero stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardFull
          title="Total Incidents"
          subtitle="All zones"
          value={1247}
          unit="cases"
          delta={-12.4}
          deltaLabel="vs last month"
          sparkData={[30, 45, 28, 50, 35, 42, 38]}
          icon={<Warning size={18} weight="duotone" />}
          positiveIsGood={false}
        />
        <StatCardFull
          title="Active Responders"
          subtitle="On duty"
          value={86}
          unit="personnel"
          delta={8.2}
          deltaLabel="vs yesterday"
          sparkData={[60, 72, 68, 80, 75, 82, 86]}
          icon={<Users size={18} weight="duotone" />}
          positiveIsGood={true}
        />
        <StatCardFull
          title="Avg Response Time"
          subtitle="Last 7 days"
          value="4.2"
          unit="min"
          delta={-18.5}
          deltaLabel="improvement"
          sparkData={[6, 5.5, 5, 4.8, 4.5, 4.3, 4.2]}
          icon={<Clock size={18} weight="duotone" />}
          positiveIsGood={false}
        />
        <StatCardFull
          title="Zone Coverage"
          subtitle="Active monitoring"
          value={92}
          unit="%"
          delta={3.1}
          deltaLabel="vs last week"
          sparkData={[85, 87, 88, 89, 90, 91, 92]}
          icon={<MapPin size={18} weight="duotone" />}
          positiveIsGood={true}
        />
      </div>

      {/* Chart blocks grid */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <ChartBlock
          title="Incidents by Type"
          subtitle="Last 30 days"
          colSpan={2}
          draggable
        >
          <div className="flex h-48 items-center justify-center rounded-lg bg-muted/20">
            <span className="text-sm text-muted-foreground">Chart placeholder</span>
          </div>
        </ChartBlock>
        <ChartBlock
          title="Zone Risk Distribution"
          subtitle="Current status"
          colSpan={1}
          draggable
        >
          <div className="flex h-48 items-center justify-center rounded-lg bg-muted/20">
            <span className="text-sm text-muted-foreground">Chart placeholder</span>
          </div>
        </ChartBlock>
      </div>

      {/* Badge showcase */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-foreground">Risk Badges</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          <RiskBadge level="critical" pulse />
          <RiskBadge level="high" />
          <RiskBadge level="medium" />
          <RiskBadge level="low" />
          <RiskBadge level="open" pulse />
          <RiskBadge level="in_progress" />
          <RiskBadge level="resolved" />
        </div>

        <h3 className="mb-3 text-sm font-medium text-foreground">Incident Type Badges</h3>
        <div className="flex flex-wrap gap-2">
          <IncidentTypeBadge type="fire" />
          <IncidentTypeBadge type="flood" />
          <IncidentTypeBadge type="crime" />
          <IncidentTypeBadge type="medical" />
          <IncidentTypeBadge type="infrastructure" />
          <IncidentTypeBadge type="weather" />
        </div>
      </div>

      {/* Zone sheet trigger */}
      <button
        onClick={() => setZoneSheetOpen(true)}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Open Zone Sheet
      </button>

      {/* Zone Sheet */}
      <ZoneSheet
        open={zoneSheetOpen}
        onOpenChange={setZoneSheetOpen}
        zoneName="Zone A-1"
        barangay="Barangay Central"
        district={1}
        riskLevel="high"
        incidentCount={24}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </AppShell>
  )
}
