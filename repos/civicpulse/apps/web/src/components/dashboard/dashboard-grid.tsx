"use client"

import { useReducer, useState } from "react"
import {
  DndContext,
  
  
  DragOverlay,
  
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChartBlock as ChartBlockComponent } from "@rie-civicpulse/ui/components/chart-block"
import { ChartRenderer } from "./chart-registry"
import { MergedBlock } from "./merged-block"
import type {DragEndEvent, DragOverEvent, DragStartEvent} from "@dnd-kit/core";
import type {BlockAction, ChartBlock} from "@/lib/dashboard-blocks";
import { DEFAULT_BLOCKS } from "@/lib/default-dashboard"
import {
  
  
  blocksReducer
} from "@/lib/dashboard-blocks"

function ChartBlockSkeleton() {
  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <div className="bg-muted h-32 animate-pulse rounded" />
    </div>
  )
}

function SortableChartBlock({
  block,
  dispatch,
  isDragging,
  isMergeTarget,
}: {
  block: ChartBlock
  dispatch: React.Dispatch<BlockAction>
  isDragging: boolean
  isMergeTarget: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        gridColumn: `span ${block.colSpan}`,
        gridRow: `span ${block.rowSpan}`,
      }}
      className={isMergeTarget ? "ring-accent ring-2" : ""}
      {...attributes}
      {...listeners}
    >
      <ChartBlockComponent
        title={block.title}
        subtitle={block.subtitle}
        draggable
        isDragging={isDragging}
        isMergeTarget={isMergeTarget}
        onRemove={() => dispatch({ type: "REMOVE", id: block.id })}
        onResize={(colSpan, rowSpan) =>
          dispatch({ type: "RESIZE", id: block.id, colSpan, rowSpan })
        }
      >
        {block.merged ? (
          <MergedBlock block={block} dispatch={dispatch} />
        ) : (
          <ChartRenderer block={block} />
        )}
      </ChartBlockComponent>
    </div>
  )
}

export function DashboardGrid() {
  const [blocks, dispatch] = useReducer(
    blocksReducer,
    DEFAULT_BLOCKS,
    (initialBlocks) => {
      return initialBlocks.map((block) => ({
        ...block,
        id: crypto.randomUUID(),
      }))
    }
  )

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [mergeTargetId, setMergeTargetId] = useState<string | null>(null)
  const [shiftPressed, setShiftPressed] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (event.over && event.over.id !== event.active.id) {
      setMergeTargetId(event.over.id as string)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingId(null)
    setMergeTargetId(null)

    if (event.active.id === event.over?.id) return

    if (!event.over) return

    const activeId = event.active.id as string
    const overId = event.over.id as string

    if (shiftPressed) {
      dispatch({ type: "MERGE", ids: [activeId, overId] })
    } else {
      dispatch({ type: "REORDER", activeId, overId })
    }
  }

  return (
    <div
      onKeyDown={(e) => setShiftPressed(e.shiftKey)}
      onKeyUp={(e) => setShiftPressed(e.shiftKey)}
      role="presentation"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {blocks.map((block) => (
              <SortableChartBlock
                key={block.id}
                block={block}
                dispatch={dispatch}
                isDragging={draggingId === block.id}
                isMergeTarget={mergeTargetId === block.id}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>{draggingId ? <ChartBlockSkeleton /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}
