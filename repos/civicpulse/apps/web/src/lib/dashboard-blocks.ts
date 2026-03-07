export type ChartType =
  | "stat-card"
  | "line"
  | "area"
  | "bar"
  | "composed"
  | "radar"
  | "pie"
  | "radial"
  | "scatter"
  | "gauge-arc"
  | "wind-rose"
  | "compass"
  | "spark-bar"
  | "timeline-heatmap"
  | "calendar-heat"
  | "bullet"

export interface ChartBlock {
  id: string
  type: ChartType
  title: string
  subtitle?: string
  dataKey: string
  colSpan: 1 | 2 | 3
  rowSpan: 1 | 2
  unit?: string
  thresholds?: { low: number; mid: number; high: number; max: number }
  merged?: Array<string>
  mergedMeta?: Array<{
    id: string
    title: string
    type: ChartType
    dataKey: string
  }>
  activeTabIndex?: number
}

export type BlockAction =
  | { type: "ADD"; block: Omit<ChartBlock, "id"> }
  | { type: "REMOVE"; id: string }
  | { type: "RESIZE"; id: string; colSpan: 1 | 2 | 3; rowSpan: 1 | 2 }
  | { type: "MERGE"; ids: [string, string] }
  | { type: "SPLIT"; id: string }
  | { type: "REORDER"; activeId: string; overId: string }
  | { type: "SET_TAB"; id: string; index: number }
  | { type: "RESET" }

function generateId(): string {
  return crypto.randomUUID()
}

export function blocksReducer(
  state: Array<ChartBlock>,
  action: BlockAction
): Array<ChartBlock> {
  switch (action.type) {
    case "ADD": {
      const newBlock: ChartBlock = {
        ...action.block,
        id: generateId(),
      }
      return [...state, newBlock]
    }

    case "REMOVE": {
      return state.filter((block) => block.id !== action.id)
    }

    case "RESIZE": {
      return state.map((block) =>
        block.id === action.id
          ? { ...block, colSpan: action.colSpan, rowSpan: action.rowSpan }
          : block
      )
    }

    case "MERGE": {
      const [id1, id2] = action.ids
      const block1 = state.find((b) => b.id === id1)
      const block2 = state.find((b) => b.id === id2)

      if (!block1 || !block2) return state

      const mergedMeta: ChartBlock["mergedMeta"] = [
        {
          id: block1.id,
          title: block1.title,
          type: block1.type,
          dataKey: block1.dataKey,
        },
        {
          id: block2.id,
          title: block2.title,
          type: block2.type,
          dataKey: block2.dataKey,
        },
      ]

      return state
        .filter((b) => b.id !== id1 && b.id !== id2)
        .concat({
          id: generateId(),
          type: "composed",
          title: `${block1.title} + ${block2.title}`,
          dataKey: block1.dataKey,
          colSpan: 3,
          rowSpan: 2,
          merged: [id1, id2],
          mergedMeta,
          activeTabIndex: 0,
        })
    }

    case "SPLIT": {
      const block = state.find((b) => b.id === action.id)
      if (!block?.merged || !block.mergedMeta) return state

      const restoredBlocks: Array<ChartBlock> = block.mergedMeta.map((meta) => ({
        id: generateId(),
        type: meta.type,
        title: meta.title,
        dataKey: meta.dataKey,
        colSpan: 1,
        rowSpan: 1,
      }))

      return state.filter((b) => b.id !== action.id).concat(restoredBlocks)
    }

    case "REORDER": {
      const oldIndex = state.findIndex((b) => b.id === action.activeId)
      const newIndex = state.findIndex((b) => b.id === action.overId)

      if (oldIndex === -1 || newIndex === -1) return state

      const newState = [...state]
      const [removed] = newState.splice(oldIndex, 1)
      newState.splice(newIndex, 0, removed)

      return newState
    }

    case "SET_TAB": {
      return state.map((block) =>
        block.id === action.id
          ? { ...block, activeTabIndex: action.index }
          : block
      )
    }

    case "RESET": {
      return []
    }

    default:
      return state
  }
}
