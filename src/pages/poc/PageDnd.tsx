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
import WidgetShelf from '../../components/layout/shelf/WidgetShelf'
import GenericWidget from '../../components/widget/GenericWidget'
import Sidebar from '../../components/layout/sidebar/Sidebar'
import DraggableWidget from '../../components/widget/DraggableWidget'

const WidgetPage = () => {
  const availableWidgets = [
    { type: 'text', label: 'Text Widget' },
    { type: 'button', label: 'Button Widget' },
    { type: 'image', label: 'Image Widget' },
    { type: 'audioPlayer', label: 'Audio Player Widget' },
    // Add more available widgets as needed
  ]

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
            content: '',
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

  const handleDeleteWidget = (id: string) => {
    setDroppedWidgets((prev) => prev.filter((widget) => widget.id !== id))
  }

  const handleResize = (
    id: string,
    newSize: { width: number; height: number },
  ) => {
    const dropAreaRect = dropAreaRef.current?.getBoundingClientRect()

    setDroppedWidgets((prev) =>
      prev.map((widget) => {
        if (widget.id === id) {
          const maxWidth = dropAreaRect
            ? dropAreaRect.width - widget.position.x
            : newSize.width
          const maxHeight = dropAreaRect
            ? dropAreaRect.height - widget.position.y
            : newSize.height

          const limitedWidth = Math.min(newSize.width, maxWidth)
          const limitedHeight = Math.min(newSize.height, maxHeight)

          return {
            ...widget,
            size: {
              width: Math.max(limitedWidth, 50), // Minimum width of 50px
              height: Math.max(limitedHeight, 50), // Minimum height of 50px
            },
          }
        }
        return widget
      }),
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
      <div
        className={`flex w-full h-screen items-center justify-center bg-[url(./assets/graph-paper.svg)]`}
      >
        <div className="flex w-full h-full">
          <div className="p-4 w-full">
            <div
              className="max-w-[920px] bg-white shadow-md h-full m-auto rounded-xl
            flex flex-col flex-grow items-center justify-start flex-1 overflow-hidden"
            >
              <div ref={dropAreaRef} className="w-full h-full">
                <DropArea>
                  {droppedWidgets.map((widget) => (
                    <GenericWidget
                      key={widget.id}
                      {...widget}
                      onContentChange={handleContentChange}
                      onResize={handleResize}
                      onDelete={handleDeleteWidget}
                    />
                  ))}
                </DropArea>
              </div>
            </div>
          </div>
        </div>
        <Sidebar position="right" title="Widgets">
          <WidgetShelf
            widgets={availableWidgets.map((widget) => widget.label)}
          />
        </Sidebar>
      </div>
      <DragOverlay>
        {activeId && activeId.startsWith('shelf-') ? (
          <DraggableWidget
            id={activeId}
            content={availableWidgets[parseInt(activeId.split('-')[1])].label}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default WidgetPage
