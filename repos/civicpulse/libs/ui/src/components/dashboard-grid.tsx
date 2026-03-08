"use client"

/**
 * DashboardGrid
 * Drag-and-drop sortable grid of ChartBlocks.
 * Uses @dnd-kit/sortable with rectSortingStrategy.
 * Column-cycle resize via ChartBlock's onColSpanChange prop.
 * Accepts a preset ("overview" | "station") to seed initial blocks.
 */

import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useReducer, useState } from "react"
import {
  blocksReducer,
  type BlockAction,
  type ChartBlock,
} from "@rie-civicpulse/ui/lib/dashboard-blocks"
import { ChartBlock as ChartBlockComponent } from "@rie-civicpulse/ui/components/chart-block"
import { ChartRenderer } from "@rie-civicpulse/ui/components/charts/chart-renderer"

interface DashboardGridProps {
  preset: "overview" | "station"
  blocks: ChartBlock[]
  dispatch: React.Dispatch<BlockAction>
}

export function DashboardGrid({
  preset,
  blocks,
  dispatch,
}: DashboardGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    dispatch({
      type: "REORDER",
      activeId: String(active.id),
      overId: String(over.id),
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-3 gap-4 p-6">
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={rectSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlock key={block.id} block={block} dispatch={dispatch} />
          ))}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="border-primary/30 bg-card h-[220px] w-[220px] rounded-lg border opacity-60 shadow-2xl" />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

interface SortableBlockProps {
  block: ChartBlock
  dispatch: React.Dispatch<BlockAction>
}

function SortableBlock({ block, dispatch }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${block.colSpan}`,
    gridRow: `span ${block.rowSpan}`,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ChartBlockComponent
        title={block.title}
        subtitle={block.subtitle}
        colSpan={block.colSpan}
        draggable
        isDragging={isDragging}
        dragListeners={listeners as unknown as Record<string, unknown>}
        dragAttributes={attributes as unknown as Record<string, unknown>}
        onColSpanChange={(colSpan) =>
          dispatch({ type: "RESIZE", id: block.id, colSpan })
        }
        onRemove={() => dispatch({ type: "REMOVE", id: block.id })}
      >
        <ChartRenderer block={block} />
      </ChartBlockComponent>
    </div>
  )
}
