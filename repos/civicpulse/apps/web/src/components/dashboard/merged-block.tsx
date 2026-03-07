import { useState } from "react"
import { ChartRenderer } from "./chart-registry"
import type { BlockAction, ChartBlock } from "@/lib/dashboard-blocks"

export function MergedBlock({
  block,
  dispatch,
}: {
  block: ChartBlock
  dispatch: React.Dispatch<BlockAction>
}) {
  const [activeTab, setActiveTab] = useState(block.activeTabIndex ?? 0)

  if (!block.mergedMeta || block.mergedMeta.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-sm">No merged blocks</div>
    )
  }

  const activeMetaIndex = Math.min(activeTab, block.mergedMeta.length - 1)
  const activeMeta = block.mergedMeta[activeMetaIndex]

  const tabBlock: ChartBlock = {
    id: block.id,
    type: activeMeta.type,
    title: activeMeta.title,
    dataKey: activeMeta.dataKey,
    colSpan: block.colSpan,
    rowSpan: block.rowSpan,
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tab buttons */}
      <div className="border-border flex gap-2 border-b">
        {block.mergedMeta.map((meta, index) => (
          <button
            key={meta.id}
            onClick={() => {
              setActiveTab(index)
              dispatch({ type: "SET_TAB", id: block.id, index })
            }}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === index
                ? "border-accent text-foreground border-b-2"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {meta.title}
          </button>
        ))}
      </div>

      {/* Chart content */}
      <div className="flex-1">
        <ChartRenderer block={tabBlock} />
      </div>

      {/* Split button */}
      <button
        onClick={() => dispatch({ type: "SPLIT", id: block.id })}
        className="bg-muted text-muted-foreground hover:bg-muted hover:text-foreground mt-2 rounded-md px-3 py-1.5 text-sm transition-colors"
      >
        Split
      </button>
    </div>
  )
}
