import { DATA_REGISTRY } from "@rie-civicpulse/mock-data"
import { CHART_COLORS } from "@/lib/chart-colors"

interface BulletChartProps {
  data?: unknown
  actual?: number
  target?: number
  max?: number
  unit?: string
}

export function BulletChart({
  data,
  actual: propActual,
  target: propTarget,
  max: propMax,
  unit = "",
}: BulletChartProps) {
  const incidents = data ?? DATA_REGISTRY.incidents
  const incidentArray = Array.isArray(incidents) ? incidents : []

  const resolvedCount = incidentArray.filter(
    (i: { status?: string }) => i.status === "resolved" || i.status === "closed"
  ).length
  const totalCount = incidentArray.length

  const actual = propActual ?? resolvedCount
  const target = propTarget ?? Math.ceil(totalCount * 0.8)
  const max = propMax ?? totalCount

  const actualPercent = max > 0 ? (actual / max) * 100 : 0
  const targetPercent = max > 0 ? (target / max) * 100 : 0

  const poorEnd = max * 0.33
  const acceptableEnd = max * 0.67

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <div className="w-full">
        <div className="text-muted-foreground mb-2 flex justify-between text-xs">
          <span>0</span>
          <span>{max}</span>
        </div>

        <div className="bg-muted/20 relative h-8 overflow-hidden rounded-sm">
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${(poorEnd / max) * 100}%`,
              backgroundColor: CHART_COLORS.fire,
              opacity: 0.2,
            }}
          />
          <div
            className="absolute inset-y-0"
            style={{
              left: `${(poorEnd / max) * 100}%`,
              width: `${((acceptableEnd - poorEnd) / max) * 100}%`,
              backgroundColor: CHART_COLORS.warning,
              opacity: 0.2,
            }}
          />
          <div
            className="absolute inset-y-0"
            style={{
              left: `${(acceptableEnd / max) * 100}%`,
              width: `${((max - acceptableEnd) / max) * 100}%`,
              backgroundColor: CHART_COLORS.success,
              opacity: 0.2,
            }}
          />

          <div
            className="bg-foreground absolute inset-y-0 left-0"
            style={{
              width: `${actualPercent}%`,
            }}
          />

          <div
            className="bg-accent absolute top-1/2 h-6 w-1 -translate-y-1/2"
            style={{
              left: `${targetPercent}%`,
              transform: "translateX(-50%) translateY(-50%)",
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs">
          <div>
            <div className="text-muted-foreground">Actual</div>
            <div className="font-semibold">
              {actual} {unit}
            </div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground">Target</div>
            <div className="font-semibold">
              {target} {unit}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
