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
import PositionedWidget from '../../components/widget/PositionedWidget'
import TextWidget from '../../components/widget/TextWidget'
import BaseWidget from '../../components/widget/BaseWidget'
import WidgetShelf from '../../components/layout/shelf/WidgetShelf'

const WidgetPage = () => {
  const [availableWidgets] = useState([
    'Widget A',
    'Widget B',
    'Widget C',
    'Widget D',
    'Widget E',
    'Widget F',
    'Text Widget',
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
          const isTextWidget = availableWidgets[widgetIndex] === 'Text Widget'
          const newWidget: WidgetData = {
            id: `widget-${droppedWidgets.length}`,
            content: availableWidgets[widgetIndex],
            position,
            size: { width: 200, height: 100 },
            ...(isTextWidget && { text: 'Editable text' }),
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="flex h-screen">
        <WidgetShelf widgets={availableWidgets} />
        <div ref={dropAreaRef} className="flex-grow">
          <DropArea>
            {droppedWidgets.map((widget) =>
              widget.content === 'Text Widget' ? (
                <TextWidget
                  key={widget.id}
                  {...widget}
                  onResize={handleResize}
                />
              ) : (
                <PositionedWidget
                  key={widget.id}
                  {...widget}
                  onResize={handleResize}
                />
              ),
            )}
          </DropArea>
        </div>
      </div>
      <DragOverlay>
        {activeId && activeId.startsWith('shelf-') ? (
          <BaseWidget
            content={availableWidgets[parseInt(activeId.split('-')[1])]}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default WidgetPage

