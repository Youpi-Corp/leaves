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
}

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

/**
 * Props for the text widget
 */
export interface TextWidgetProps extends BaseWidgetProps {
  text: string
  format?: 'plain' | 'markdown' | 'html'
  fontSize?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
}

/**
 * Props for the image widget
 */
export interface ImageWidgetProps extends BaseWidgetProps {
  imageUrl: string
  altText?: string
  aspectRatio?: 'original' | '1:1' | '4:3' | '16:9'
  caption?: string
}

/**
 * Props for the list widget
 */
export interface ListWidgetProps extends BaseWidgetProps {
  items: string[]
  ordered?: boolean
  startNumber?: number
  bulletStyle?: 'disc' | 'circle' | 'square' | 'none'
}

/**
 * Props for the code widget
 */
export interface CodeWidgetProps extends BaseWidgetProps {
  code: string
  language?: string
  theme?: 'light' | 'dark'
  showLineNumbers?: boolean
}
