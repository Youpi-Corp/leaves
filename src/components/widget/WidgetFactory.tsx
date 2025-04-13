import React from 'react'
import { BaseWidgetProps } from '../../types/WidgetTypes'
import WidgetContainer from './WidgetContainer'

// Import default widgets to ensure they are registered
// In a real application, we might have a more dynamic/lazy loading strategy
import './widgets' // This will be a barrel file importing all widgets

interface WidgetFactoryProps<T extends BaseWidgetProps> {
  data: T
  onUpdate?: (id: string, newData: T) => void
  onDelete?: (id: string) => void
  onSelect?: () => void
  isSelected?: boolean
  isEditable?: boolean
  isDraggable?: boolean
  className?: string
}

/**
 * WidgetFactory - Creates widget instances based on their type
 * Serves as the main entry point for using widgets in the application
 */
function WidgetFactory<T extends BaseWidgetProps>({
  data,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
  isEditable = true,
  isDraggable = true,
  className,
}: WidgetFactoryProps<T>) {
  // The WidgetContainer handles everything, including registry lookup
  return (
    <WidgetContainer
      data={data}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onSelect={onSelect}
      isSelected={isSelected}
      isEditable={isEditable}
      isDraggable={isDraggable}
      className={className}
    />
  )
}

export default WidgetFactory
