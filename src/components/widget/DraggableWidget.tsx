import { useDraggable } from '@dnd-kit/core'

const DraggableWidget = ({ id, content }: { id: string; content: string }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center justify-center w-24 h-24 bg-white border border-gray-300
      hover:bg-gray-100 transition-colors shadow-md rounded-md cursor-grab text-xs"
    >
      {content}
    </div>
  )
}

export default DraggableWidget
