import React, { useRef, useState } from 'react'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { useDraggable } from '@dnd-kit/core'
import WidgetData from '../../types/WidgetData'
import TextWidget from './TextWidget'
import ButtonWidget from './ButtonWidget'
import ImageWidget from './ImageWidget'
import AudioPlayerWidget from './AudioPlayerWidget'
import MarkdownWidget from './MarkdownWidget'

const widgetComponents: { [key: string]: React.ComponentType<any> } = {
  text: TextWidget,
  button: ButtonWidget,
  image: ImageWidget,
  audioPlayer: AudioPlayerWidget,
  markdown: MarkdownWidget,
  // Add more widget types as needed
}

interface GenericWidgetProps extends WidgetData {
  onDelete: (id: string) => void
  onResize: (id: string, newSize: { width: number; height: number }) => void
  onContentChange: (id: string, newContent: any) => void
}

const GenericWidget: React.FC<GenericWidgetProps> = (props) => {
  const { id, type, content, position, size, onResize, onContentChange } = props
  const [isResizing, setIsResizing] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id })

  const SpecificWidget = widgetComponents[type]

  if (!SpecificWidget) {
    return <div>Unknown widget type: {type}</div>
  }

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

  const handleResize = (_e: React.SyntheticEvent, data: ResizeCallbackData) => {
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
        <div ref={headerRef} className="bg-gray-200 cursor-move text-sm">
          Drag here
        </div>
        <button
          onClick={() => props.onDelete(id)}
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          style={{ transform: 'translate(50%, -50%)' }}
        >
          ×
        </button>
        <div className="p-4 flex flex-col h-full">
          <SpecificWidget
            {...props}
            content={content}
            onContentChange={(newContent: any) =>
              onContentChange(id, newContent)
            }
          />
        </div>
      </div>
    </Resizable>
  )
}

export default GenericWidget
