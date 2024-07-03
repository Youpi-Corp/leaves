import React, { useState, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import 'react-resizable/css/styles.css'

interface WidgetData {
  id: string
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

const DraggableWidget = ({ id, content }: { id: string; content: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white shadow-md rounded-lg mb-2"
    >
      {content}
    </div>
  )
}

interface PositionedWidgetProps extends WidgetData {
  onResize: (id: string, size: { width: number; height: number }) => void
}
const PositionedWidget: React.FC<PositionedWidgetProps> = ({
  id,
  content,
  position,
  size,
  onResize,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id })
  const [isResizing, setIsResizing] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const style: React.CSSProperties = {
    position: 'absolute',
    top: position.y,
    left: position.x,
    width: size.width,
    height: size.height,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging || isResizing ? 1000 : 1,
    touchAction: 'none',
  }

  if (transform) {
    style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`
  }

  const handleResize = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
    onResize(id, { width: data.size.width, height: data.size.height })
  }

  const handleResizeStart = () => setIsResizing(true)
  const handleResizeStop = () => setIsResizing(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as Node
    if (headerRef.current && headerRef.current.contains(target)) {
      // Only activate dragging if the pointer down event is on the header
      ;(listeners as any)?.onPointerDown(e)
    }
  }

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={handleResize}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      draggableOpts={{ grid: [10, 10] }}
      resizeHandles={['se', 'e', 's']}
    >
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white shadow-md rounded-lg overflow-hidden"
        {...attributes}
        onPointerDown={handlePointerDown}
      >
        <div ref={headerRef} className="p-2 bg-gray-200 cursor-move">
          Drag here
        </div>
        <div className="p-4">{content}</div>
      </div>
    </Resizable>
  )
}

const Widget = ({ content }: { content: string }) => {
  return <div className="p-4 bg-white shadow-md rounded-lg">{content}</div>
}

const WidgetShelf = ({ widgets }: { widgets: string[] }) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Widget Shelf</h2>
      {widgets.map((widget, index) => (
        <DraggableWidget
          key={`shelf-${index}`}
          id={`shelf-${index}`}
          content={widget}
        />
      ))}
    </div>
  )
}

const DropArea = ({ children }: { children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({
    id: 'drop-area',
  })

  return (
    <div
      ref={setNodeRef}
      className="flex-grow bg-gray-200 p-4 relative"
      style={{ height: '100%', minHeight: '600px' }}
    >
      <h2 className="text-xl font-bold mb-4">Drop Area</h2>
      {children}
    </div>
  )
}

const WidgetPage = () => {
  const [availableWidgets] = useState([
    'Widget A',
    'Widget B',
    'Widget C',
    'Widget D',
    'Widget E',
    'Widget F',
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
          const newWidget: WidgetData = {
            id: `widget-${droppedWidgets.length}`,
            content: availableWidgets[widgetIndex],
            position,
            size: { width: 200, height: 100 }, // Default size
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
            {droppedWidgets.map((widget) => (
              <PositionedWidget
                key={widget.id}
                {...widget}
                onResize={handleResize}
              />
            ))}
          </DropArea>
        </div>
      </div>
      <DragOverlay>
        {activeId && activeId.startsWith('shelf-') ? (
          <Widget
            content={availableWidgets[parseInt(activeId.split('-')[1])]}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default WidgetPage
