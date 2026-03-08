/**
 * Dashboard block state — types, reducer, and default layouts.
 * Used by both Overview and Station View grids.
 * No external state library — useReducer in DashboardGrid.
 * Atom stubs exported for future Jotai wiring.
 */

import { OVERVIEW_BLOCKS, STATION_BLOCKS } from "./default-blocks"

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
}

export type BlockAction =
  | { type: "ADD"; block: Omit<ChartBlock, "id"> }
  | { type: "REMOVE"; id: string }
  | { type: "RESIZE"; id: string; colSpan: 1 | 2 | 3 }
  | { type: "REORDER"; activeId: string; overId: string }
  | { type: "RESET"; preset: "overview" | "station" }

export function blocksReducer(
  state: ChartBlock[],
  action: BlockAction
): ChartBlock[] {
  switch (action.type) {
    case "ADD": {
      const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      return [...state, { ...action.block, id }]
    }
    case "REMOVE":
      return state.filter((b) => b.id !== action.id)
    case "RESIZE": {
      return state.map((b) =>
        b.id === action.id ? { ...b, colSpan: action.colSpan } : b
      )
    }
    case "REORDER": {
      const activeIndex = state.findIndex((b) => b.id === action.activeId)
      const overIndex = state.findIndex((b) => b.id === action.overId)
      if (activeIndex === -1 || overIndex === -1) return state
      const newState = [...state]
      const [removed] = newState.splice(activeIndex, 1)
      newState.splice(overIndex, 0, removed)
      return newState
    }
    case "RESET": {
      const preset =
        action.preset === "station" ? STATION_BLOCKS : OVERVIEW_BLOCKS
      return preset.map((b, i) => ({
        ...b,
        id: `block-${action.preset}-${i}`,
      }))
    }
    default:
      return state
  }
}

// Atom stubs — not wired into components
export const chartBlocksAtom = null
// TODO: implement with jotai atomWithStorage when Jotai is added
