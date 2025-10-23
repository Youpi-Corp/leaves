import React, { useRef, useState, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { BaseWidgetProps } from '../../types/WidgetTypes'

export interface WidgetBaseProps<T extends BaseWidgetProps = BaseWidgetProps> {
  info: T
  content: React.ReactNode
  onDelete?: (id: string) => void
}

const WidgetBase = <T extends BaseWidgetProps>({
  info,
  content,
  onDelete,
}: WidgetBaseProps<T>) => {
  const [isActive, setIsActive] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: info.id,
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (
        target.classList.contains('delete-button') ||
        (headerRef.current && headerRef.current.contains(target))
      ) {
        return
      }

      if (!nodeRef.current?.contains(target)) {
        setIsActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [headerRef])

  const handleWidgetClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsActive(true)
  }

  return (
    <div
      ref={nodeRef}
      className="h-full bg-white shadow-md rounded-lg overflow-hidden relative"
      onClick={handleWidgetClick}
    >
      {isActive && (
        <div
          ref={(node) => {
            setNodeRef(node)
            headerRef.current = node
          }}
          {...attributes}
          {...listeners}
          className="drag-handle bg-gray-200 cursor-move text-sm p-1"
        >
          Drag here
        </div>
      )}
      {isActive && onDelete && (
        <button
          onClick={() => onDelete(info.id)}
          className="delete-button absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          style={{ transform: 'translate(50%, -50%)' }}
        >
          ×
        </button>
      )}
      <div className="p-4">
        <h4>{info.label}</h4>
        <div style={{ color: info.color || '#000' }}>{content}</div>
      </div>
    </div>
  )
}

export default WidgetBase
