import React, { useRef, useState } from 'react'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { useDraggable } from '@dnd-kit/core'
import WidgetData from '../../types/WidgetData'

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

export default PositionedWidget