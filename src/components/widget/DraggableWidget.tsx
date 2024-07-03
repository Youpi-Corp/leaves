import React from 'react'
import { useDraggable } from '@dnd-kit/core'

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

export default DraggableWidget
