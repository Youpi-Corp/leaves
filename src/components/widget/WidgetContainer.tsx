import React, { useState, useRef, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { BaseWidgetProps, WidgetState } from '../../types/WidgetTypes'
import { getWidgetByType } from './WidgetRegistry'

interface WidgetContainerProps<T extends BaseWidgetProps> {
  data: T
  onDelete?: (id: string) => void
  onUpdate?: (id: string, newData: T) => void
  onSelect?: () => void
  isSelected?: boolean
  isEditable?: boolean
  isDraggable?: boolean
  className?: string
  onQuizAnswer?: (isCorrect: boolean, answer?: unknown) => void
}

/**
 * WidgetContainer - The foundation component that wraps all widget instances
 * Provides consistent UI, interactions, edit/view mode toggle, and drag-and-drop
 */
function WidgetContainer<T extends BaseWidgetProps>({
  data,
  onDelete,
  onUpdate,
  onSelect,
  isSelected = false,
  isEditable = true,
  isDraggable = true,
  className = '',
  onQuizAnswer,
}: WidgetContainerProps<T>) {
  // Widget state management - now using isSelected from props
  const [widgetState, setWidgetState] = useState<WidgetState>({
    isEditing: false,
    isSelected: isSelected,
  })

  // Update internal state when isSelected prop changes
  useEffect(() => {
    setWidgetState((prev) => ({
      ...prev,
      isSelected,
    }))
  }, [isSelected])

  const containerRef = useRef<HTMLDivElement>(null)

  // Get the widget implementation from registry
  const widget = getWidgetByType<T>(data.type)

  if (!widget) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        Widget type &quot;{data.type}&quot; not found
      </div>
    )
  }

  // Extract the View and Edit components
  const { ViewComponent, EditComponent } = widget.component

  // Setup drag-and-drop - only used for additional drag effects
  // The actual drag behavior is controlled by ReactGridLayout
  const { isDragging } = useDraggable({
    id: data.id,
    disabled: !isDraggable || widgetState.isEditing,
  })

  const dragHandleRef = useRef<HTMLDivElement>(null)

  // Event handlers
  const handleSelect = (e: React.MouseEvent) => {
    // Don't select if clicking on drag handle or already in edit mode
    if (
      dragHandleRef.current?.contains(e.target as Node) ||
      widgetState.isEditing
    ) {
      return
    }

    // Call the onSelect handler from props instead of managing selection internally
    if (onSelect) {
      onSelect()
    }
  }

  const handleEdit = () => {
    setWidgetState({
      isSelected: true,
      isEditing: true,
    })
  }

  const handleSave = () => {
    setWidgetState({
      isSelected: true,
      isEditing: false,
    })
  }

  const handleCancel = () => {
    setWidgetState({
      isSelected: true,
      isEditing: false,
    })
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(data.id)
    }
  }

  const handleDataChange = (newData: T) => {
    if (onUpdate) {
      onUpdate(data.id, newData)
    }
  }
  // Compute CSS classes
  const containerClasses = [
    'relative border rounded-lg transition-all duration-200 w-full h-full flex flex-col',
    // Only apply hover effects in edit mode (isEditable)
    isEditable ? 'shadow-sm hover:shadow-md' : 'shadow-none',
    isDragging ? 'opacity-50 shadow-xl' : 'opacity-100',
    widgetState.isSelected
      ? 'border-blue-400 shadow-md'
      : isEditable
      ? 'border-transparent hover:border-gray-200'
      : 'border-transparent',
    widgetState.isEditing ? 'ring-2 ring-blue-400' : '',
    className,
  ].join(' ')
  // Compute content area classes - add scrolling in edit mode
  const contentClasses = [
    'widget-content p-4 flex-grow flex flex-col w-full h-full',
    widgetState.isEditing ? 'overflow-y-auto' : 'overflow-clip',
  ].join(' ')

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      onClick={handleSelect}
      data-widget-id={data.id}
      data-widget-type={data.type}
    >
      {/* Widget toolbar - only visible when selected */}
      {widgetState.isSelected && !widgetState.isEditing && isEditable && (
        <div className="absolute top-0 right-0 p-1 bg-white/70 backdrop-blur-sm flex gap-1 rounded-bl-md z-10">
          <button
            className="text-blue-600 hover:bg-blue-50 p-1 rounded"
            onClick={handleEdit}
            aria-label="Edit widget"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            className="text-red-600 hover:bg-red-50 p-1 rounded"
            onClick={handleDelete}
            aria-label="Delete widget"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Drag handle - only visible when selected */}
      {isDraggable && widgetState.isSelected && !widgetState.isEditing && (
        <div
          ref={dragHandleRef}
          className="widget-drag-handle absolute top-0 left-0 p-1 cursor-move bg-white/70 backdrop-blur-sm rounded-br-md z-10"
          aria-label="Drag to move"
        >
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </div>
      )}

      {/* Widget content - fully filling the container */}
      <div className={contentClasses}>
        {!widgetState.isEditing ? (
          <ViewComponent
            widgetData={data}
            onEdit={isEditable ? handleEdit : undefined}
            onAnswer={onQuizAnswer}
          />
        ) : (
          <EditComponent
            widgetData={data}
            onChange={handleDataChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>

      {/* Fixed action buttons for edit mode - shown at bottom of container */}
      {widgetState.isEditing && (
        <div className="sticky bottom-0 left-0 right-0 bg-white p-2 border-t flex justify-end space-x-2 z-10">
          <button
            onClick={handleCancel}
            className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}

export default WidgetContainer
