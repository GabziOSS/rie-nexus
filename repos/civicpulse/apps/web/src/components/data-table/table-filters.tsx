"use client"

import { useState } from "react"
import { X } from "@phosphor-icons/react"
import { ZONES } from "@rie-civicpulse/mock-data"
import { cn } from "@rie-civicpulse/ui/lib/utils"

interface TableFiltersProps {
  timeRange: { from: Date | null; to: Date | null }
  onTimeRangeChange: (range: { from: Date | null; to: Date | null }) => void
  selectedZones: string[]
  onSelectedZonesChange: (zones: string[]) => void
  responderRange: { min: number; max: number }
  onResponderRangeChange: (range: { min: number; max: number }) => void
}

const QUICK_PRESETS = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
]

export function TableFilters({
  timeRange,
  onTimeRangeChange,
  selectedZones,
  onSelectedZonesChange,
  responderRange,
  onResponderRangeChange,
}: TableFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [zoneSearchOpen, setZoneSearchOpen] = useState(false)
  const [zoneSearch, setZoneSearch] = useState("")

  const handleQuickPreset = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    onTimeRangeChange({ from, to })
  }

  const handleClearTimeRange = () => {
    onTimeRangeChange({ from: null, to: null })
  }

  const toggleZone = (zoneId: string) => {
    onSelectedZonesChange(
      selectedZones.includes(zoneId)
        ? selectedZones.filter((z) => z !== zoneId)
        : [...selectedZones, zoneId]
    )
  }

  const filteredZones = ZONES.filter((zone) =>
    zone.name.toLowerCase().includes(zoneSearch.toLowerCase())
  )

  const activeFilterCount =
    (timeRange.from || timeRange.to ? 1 : 0) +
    selectedZones.length +
    (responderRange.min > 0 || responderRange.max < 10 ? 1 : 0)

  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-sm font-medium"
      >
        <span>Advanced Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
            {activeFilterCount} active
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="border-border mt-4 space-y-4 border-t pt-4">
          {/* Time Range */}
          <div>
            <label className="text-muted-foreground text-xs font-semibold">
              Date Range
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleQuickPreset(preset.days)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    timeRange.from &&
                      new Date().getTime() - timeRange.from.getTime() <=
                        preset.days * 24 * 60 * 60 * 1000
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {(timeRange.from || timeRange.to) && (
              <button
                onClick={handleClearTimeRange}
                className="text-muted-foreground hover:text-foreground mt-2 text-xs"
              >
                Clear date range
              </button>
            )}
          </div>

          {/* Zone Multi-Select */}
          <div>
            <label className="text-muted-foreground text-xs font-semibold">
              Zones
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Search zones..."
                value={zoneSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setZoneSearch(e.target.value)
                }
                onFocus={() => setZoneSearchOpen(true)}
                className="border-border bg-card placeholder-muted-foreground focus:border-primary w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
              />

              {zoneSearchOpen && (
                <div className="border-border bg-card absolute top-full z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border shadow-lg">
                  {filteredZones.map((zone) => (
                    <label
                      key={zone.id}
                      className="border-border/50 hover:bg-muted/50 flex items-center gap-2 border-b px-3 py-2 text-sm last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedZones.includes(zone.id)}
                        onChange={() => toggleZone(zone.id)}
                        className="rounded"
                      />
                      <span>{zone.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {selectedZones.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedZones.map((zoneId) => {
                  const zone = ZONES.find((z) => z.id === zoneId)
                  return (
                    <div
                      key={zoneId}
                      className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                    >
                      {zone?.name}
                      <button
                        onClick={() => toggleZone(zoneId)}
                        className="hover:opacity-70"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Responder Range */}
          <div>
            <label className="text-muted-foreground text-xs font-semibold">
              Assigned Responders
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="10"
                value={responderRange.min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onResponderRangeChange({
                    ...responderRange,
                    min: parseInt(e.target.value) || 0,
                  })
                }
                className="border-border bg-card w-16 rounded-lg border px-2 py-1.5 text-sm"
              />
              <span className="text-muted-foreground text-xs">to</span>
              <input
                type="number"
                min="0"
                max="10"
                value={responderRange.max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onResponderRangeChange({
                    ...responderRange,
                    max: parseInt(e.target.value) || 10,
                  })
                }
                className="border-border bg-card w-16 rounded-lg border px-2 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
