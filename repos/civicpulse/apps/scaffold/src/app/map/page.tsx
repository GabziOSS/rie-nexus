"use client"

import { useState } from "react"
import { MapTrifold } from "@phosphor-icons/react"
import { AppShell } from "@rie-civicpulse/ui/components/app-shell"
import { LayerDrawer } from "@rie-civicpulse/ui/components/layer-drawer"
import { ZoneSheet } from "@rie-civicpulse/ui/components/zone-sheet"

export default function MapPage() {
  const [zoneSheetOpen, setZoneSheetOpen] = useState(false)
  const [layerDrawerOpen, setLayerDrawerOpen] = useState(true)

  return (
    <AppShell currentPath="/map">
      <div className="relative h-full w-full overflow-hidden">
        {/* Map placeholder */}
        <div className="bg-card text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-3">
          <MapTrifold size={48} weight="thin" className="opacity-20" />
          <p className="text-sm">MapLibre GL map renders here</p>
          <p className="text-xs opacity-60">
            Wired by opencode in a later chunk
          </p>
          <button
            onClick={() => setZoneSheetOpen(true)}
            className="text-primary mt-4 text-xs underline underline-offset-2"
          >
            Preview ZoneSheet →
          </button>
        </div>

        {/* Layer drawer — rendered over map */}
        <LayerDrawer
          open={layerDrawerOpen}
          onOpenChange={setLayerDrawerOpen}
          showIncidentPoints={true}
          onToggleIncidentPoints={() => {}}
          showHeatmap={false}
          onToggleHeatmap={() => {}}
          layers={[
            {
              id: "incidents_total",
              label: "Total Incidents",
              active: true,
              opacity: 80,
            },
          ]}
          onLayerToggle={() => {}}
          onLayerOpacityChange={() => {}}
        />

        {/* Zone sheet preview */}
        <ZoneSheet
          open={zoneSheetOpen}
          onOpenChange={setZoneSheetOpen}
          zoneName="Poblacion Central"
          barangay="Poblacion 1-2"
          district={1}
          riskLevel="high"
          coordinates={[124.5908, 12.0685]}
          incidentCount={47}
        />
      </div>
    </AppShell>
  )
}
