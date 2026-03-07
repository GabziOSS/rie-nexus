/**
 * LayerDrawer — Left-side panel for map layer controls.
 * Persistent on desktop, floating on mobile.
 * Contains base layers, incident overlays, and chart data layers with toggles/opacity.
 */

import { useCallback, useMemo } from "react"
import { X, Stack, MapTrifold, Fire } from "@phosphor-icons/react"
import { cn } from "@rie-civicpulse/ui/lib/utils"

// TODO: wire activeMapLayersAtom from atoms/map.atoms.ts
// TODO: wire showHeatmapAtom from atoms/map.atoms.ts
// TODO: wire layerOpacityAtom from atoms/map.atoms.ts

export interface LayerConfig {
  id: string
  label: string
  active: boolean
  opacity: number
}

export interface LayerDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Data layers with toggle/opacity controls */
  layers?: LayerConfig[]
  onLayerToggle?: (layerId: string) => void
  onLayerOpacityChange?: (layerId: string, opacity: number) => void
  /** Incident point visibility */
  showIncidentPoints?: boolean
  onToggleIncidentPoints?: () => void
  /** Heatmap visibility */
  showHeatmap?: boolean
  onToggleHeatmap?: () => void
  /** Additional className */
  className?: string
}

function LayerDrawer({
  open,
  onOpenChange,
  layers = [],
  onLayerToggle,
  onLayerOpacityChange,
  showIncidentPoints = true,
  onToggleIncidentPoints,
  showHeatmap = false,
  onToggleHeatmap,
  className,
}: LayerDrawerProps) {
  // Handler for closing drawer
  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  // Memoize active layers for filtering
  const activeLayers = useMemo(
    () => layers.filter((layer) => layer.active),
    [layers]
  )

  // Handler for layer toggle
  const handleLayerToggle = useCallback(
    (layerId: string) => {
      onLayerToggle?.(layerId)
    },
    [onLayerToggle]
  )

  // Handler for opacity change
  const handleOpacityChange = useCallback(
    (layerId: string, value: number) => {
      onLayerOpacityChange?.(layerId, value)
    },
    [onLayerOpacityChange]
  )

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Map layers panel"
      className={cn(
        "absolute bottom-4 left-4 top-4 z-30 flex w-64 flex-col rounded-lg border border-border bg-card shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Stack size={16} className="text-primary" weight="duotone" />
          <span className="text-sm font-medium text-foreground">Layers</span>
        </div>
        <button
          onClick={handleClose}
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close layers panel"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {/* Base Layers (always on) */}
        <section>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Base Layers
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5">
              <MapTrifold size={14} className="text-primary" aria-hidden="true" />
              <span className="text-sm text-foreground">Zone Risk Fill</span>
              <span className="ml-auto text-xs text-muted-foreground">Always on</span>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5">
              <MapTrifold size={14} className="text-primary" aria-hidden="true" />
              <span className="text-sm text-foreground">Zone Outlines</span>
              <span className="ml-auto text-xs text-muted-foreground">Always on</span>
            </div>
          </div>
        </section>

        {/* Incident Overlays */}
        <section>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Incident Overlays
          </h4>
          <div className="space-y-1.5">
            {/* Incident Points */}
            <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30">
              <input
                type="checkbox"
                checked={showIncidentPoints}
                onChange={onToggleIncidentPoints}
                className="size-4 rounded border-border accent-primary"
              />
              <Fire size={14} className="text-destructive" aria-hidden="true" />
              <span className="text-sm text-foreground">Incident Points</span>
            </label>

            {/* Heatmap Density */}
            <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={onToggleHeatmap}
                className="size-4 rounded border-border accent-primary"
              />
              <div
                className="size-3.5 rounded-sm bg-gradient-to-r from-primary/20 via-accent/50 to-destructive/80"
                aria-hidden="true"
              />
              <span className="text-sm text-foreground">Heatmap Density</span>
            </label>
          </div>
        </section>

        {/* Chart Data Layers */}
        {layers.length > 0 && (
          <section>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Chart Data Layers
            </h4>
            <div className="space-y-2">
              {layers.map((layer) => (
                <div key={layer.id} className="space-y-1.5">
                  <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30">
                    <input
                      type="checkbox"
                      checked={layer.active}
                      onChange={() => handleLayerToggle(layer.id)}
                      className="size-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm text-foreground">{layer.label}</span>
                  </label>

                  {/* Opacity slider - only shown when active */}
                  {layer.active && (
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-xs text-muted-foreground">Opacity</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={layer.opacity}
                        onChange={(e) =>
                          handleOpacityChange(layer.id, parseInt(e.target.value))
                        }
                        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                        aria-label={`${layer.label} opacity`}
                      />
                      <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                        {layer.opacity}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer with layer count */}
      <div className="border-t border-border px-3 py-2">
        <p className="text-xs text-muted-foreground">
          {activeLayers.length} of {layers.length} layers active
        </p>
      </div>
    </div>
  )
}

export { LayerDrawer }
export default LayerDrawer
