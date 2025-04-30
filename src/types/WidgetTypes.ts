/**
 * Core types for the Widget System
 */
import React from 'react'

/**
 * Base properties that all widgets share
 */
export interface BaseWidgetProps {
  id: string
  type: string
  label: string
  color?: string
  // This allows widgets to add their own properties
  [key: string]: unknown
}

/**
 * Type guard to check if a widget is of a specific type
 */
export function isWidgetType<T extends BaseWidgetProps>(
  widget: BaseWidgetProps,
  type: string
): widget is T {
  return widget.type === type
}

// Widget-specific props can be now defined in their respective files
// And used with type assertions or the type guard function

/**
 * Widget state - controls whether the widget is in edit mode or view mode
 */
export interface WidgetState {
  isEditing: boolean
  isSelected: boolean
}

/**
 * Props for the edit mode of any widget
 */
export interface WidgetEditProps<T extends BaseWidgetProps> {
  widgetData: T
  onChange: (updatedData: T) => void
  onSave: () => void
  onCancel: () => void
}

/**
 * Props for the view mode of any widget
 */
export interface WidgetViewProps<T extends BaseWidgetProps> {
  widgetData: T
  onEdit?: () => void
}

/**
 * Interface that all widget components must implement
 */
export interface WidgetComponentInterface<T extends BaseWidgetProps> {
  ViewComponent: React.FC<WidgetViewProps<T>>
  EditComponent: React.FC<WidgetEditProps<T>>
}

/**
 * Widget metadata for registration and discovery
 */
export interface WidgetMetadata {
  type: string
  displayName: string
  description: string
  icon: string // Icon name from the icon library or URL
  category: string // For grouping widgets in the widget picker
  version: string
  author?: string
  authorUrl?: string
  tags?: string[]
}

/**
 * Type for the widget registry
 */
export interface WidgetRegistryEntry<
  T extends BaseWidgetProps = BaseWidgetProps
> {
  metadata: WidgetMetadata
  component: WidgetComponentInterface<T>
}

// Legacy widget props definitions have been moved to their own files
// Each widget now defines its own props in its own file and registers them with WidgetPropsRegistry
