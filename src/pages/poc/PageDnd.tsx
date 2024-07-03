import { useState, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import 'react-resizable/css/styles.css'
import DropArea from '../../components/interaction/dropArea/DropArea'
import WidgetData from '../../types/WidgetData'
import BaseWidget from '../../components/widget/BaseWidget'
import WidgetShelf from '../../components/layout/shelf/WidgetShelf'
import GenericWidget from '../../components/widget/GenericWidget'

const WidgetPage = () => {
  const [availableWidgets] = useState([
    { type: 'text', label: 'Text Widget' },
    { type: 'button', label: 'Button Widget' },
    { type: 'image', label: 'Image Widget' },
    // Add more available widgets as needed
  ])

  const [droppedWidgets, setDroppedWidgets] = useState<WidgetData[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && over.id === 'drop-area') {
      const dropRect = dropAreaRef.current?.getBoundingClientRect()
      if (dropRect) {
        if (active.id.toString().startsWith('shelf-')) {
          // Adding a new widget from the shelf
          const position = {
            x: Math.max(
              0,
              Math.min(
                event.delta.x +
                  (event.activatorEvent as PointerEvent).clientX -
                  dropRect.left,
                dropRect.width - 200,
              ),
            ),
            y: Math.max(
              0,
              Math.min(
                event.delta.y +
                  (event.activatorEvent as PointerEvent).clientY -
                  dropRect.top,
                dropRect.height - 100,
              ),
            ),
          }
          const widgetIndex = parseInt(active.id.toString().split('-')[1])
          const widgetType = availableWidgets[widgetIndex].type
          const newWidget: WidgetData = {
            id: `widget-${droppedWidgets.length}`,
            type: widgetType,
            content:
              widgetType === 'text'
                ? 'Editable text'
                : { label: 'Click me', clicks: 0 },
            position,
            size: { width: 200, height: 100 },
          }
          setDroppedWidgets((prev) => [...prev, newWidget])
        } else {
          // Moving an existing widget
          setDroppedWidgets((prev) =>
            prev.map((widget) =>
              widget.id === active.id
                ? {
                    ...widget,
                    position: {
                      x: Math.max(
                        0,
                        Math.min(
                          widget.position.x + event.delta.x,
                          dropRect.width - widget.size.width,
                        ),
                      ),
                      y: Math.max(
                        0,
                        Math.min(
                          widget.position.y + event.delta.y,
                          dropRect.height - widget.size.height,
                        ),
                      ),
                    },
                  }
                : widget,
            ),
          )
        }
      }
    }
    setActiveId(null)
  }

  const handleResize = (
    id: string,
    newSize: { width: number; height: number },
  ) => {
    setDroppedWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, size: newSize } : widget,
      ),
    )
  }

  const handleContentChange = (id: string, newContent: any) => {
    setDroppedWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, content: newContent } : widget,
      ),
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="flex h-screen">
        <WidgetShelf widgets={availableWidgets.map((widget) => widget.label)} />
        <div ref={dropAreaRef} className="flex-grow">
          <DropArea>
            {droppedWidgets.map((widget) => (
              <GenericWidget
                key={widget.id}
                {...widget}
                onContentChange={handleContentChange}
                onResize={handleResize}
              />
            ))}
          </DropArea>
        </div>
      </div>
      <DragOverlay>
        {activeId && activeId.startsWith('shelf-') ? (
          <BaseWidget
            content={availableWidgets[parseInt(activeId.split('-')[1])].label}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default WidgetPage
