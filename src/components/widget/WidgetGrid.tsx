import React, { useState } from 'react'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { BaseWidgetProps } from '../../types/WidgetTypes'
import WidgetFactory from './WidgetFactory'
import WidgetPicker from './WidgetPicker'

interface WidgetGridProps {
  widgets: BaseWidgetProps[]
  onWidgetsChange: (widgets: BaseWidgetProps[]) => void
  className?: string
  isEditable?: boolean
}

/**
 * WidgetGrid Component
 *
 * A container that displays widgets in a grid/list layout with drag-and-drop reordering
 */
const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onWidgetsChange,
  className = '',
  isEditable = true,
}) => {
  const [showWidgetPicker, setShowWidgetPicker] = useState(false)

  // Handle adding a new widget to the grid
  const handleAddWidget = (widgetData: BaseWidgetProps) => {
    onWidgetsChange([...widgets, widgetData])
    setShowWidgetPicker(false)
  }

  // Handle updating a widget's data
  const handleUpdateWidget = (id: string, newData: BaseWidgetProps) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.id === id ? newData : widget
    )
    onWidgetsChange(updatedWidgets)
  }

  // Handle deleting a widget
  const handleDeleteWidget = (id: string) => {
    const updatedWidgets = widgets.filter((widget) => widget.id !== id)
    onWidgetsChange(updatedWidgets)
  }

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = widgets.findIndex((widget) => widget.id === active.id)
    const newIndex = widgets.findIndex((widget) => widget.id === over.id)

    const reorderedWidgets = arrayMove(widgets, oldIndex, newIndex)
    onWidgetsChange(reorderedWidgets)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Widget Picker Dialog */}
      {showWidgetPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Add Widget</h3>
              <button
                onClick={() => setShowWidgetPicker(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <WidgetPicker onWidgetSelect={handleAddWidget} />
          </div>
        </div>
      )}

      {/* Main Widget Grid */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={widgets.map((widget) => widget.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {widgets.length === 0 && (
              <div className="p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500">
                <svg
                  className="w-12 h-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg">No widgets added yet</p>
                <p className="text-sm">
                  Click the button below to add your first widget
                </p>
              </div>
            )}

            {widgets.map((widget) => (
              <div key={widget.id} className="w-full">
                <WidgetFactory
                  data={widget}
                  onUpdate={handleUpdateWidget}
                  onDelete={handleDeleteWidget}
                  isEditable={isEditable}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Widget Button */}
      {isEditable && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowWidgetPicker(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Widget
          </button>
        </div>
      )}
    </div>
  )
}

export default WidgetGrid
