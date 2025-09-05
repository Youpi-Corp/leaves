import React from 'react'
import {
  BaseWidgetProps,
  WidgetViewProps,
  WidgetEditProps,
  WidgetComponentInterface,
  WidgetMetadata,
} from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'
import ReactMarkdown from 'react-markdown'

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
 * Register TextWidget props with the registry
 */
declare module '../../../types/WidgetPropsRegistry' {
  interface WidgetPropsRegistry {
    TextWidget: TextWidgetProps
  }
}

// Text Widget metadata
const textWidgetMetadata: WidgetMetadata = {
  type: 'TextWidget',
  displayName: 'Text',
  description: 'Display formatted text content',
  icon: 'text',
  category: 'Content',
  version: '1.0.0',
  tags: ['text', 'content', 'markdown'],
}

/**
 * Text Widget View Component
 * Displays formatted text content
 */
const TextWidgetView: React.FC<WidgetViewProps<TextWidgetProps>> = ({
  widgetData,
}) => {
  const { text, format, fontSize = 'base', textAlign = 'left' } = widgetData

  // Apply font size classes
  const fontSizeClass =
    {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    }[fontSize] || 'text-base'

  // Apply text alignment
  const alignmentClass =
    {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    }[textAlign] || 'text-left'

  return (
    <div className={`w-full h-full flex flex-col ${alignmentClass}`}>
      {widgetData.label && (
        <h3 className="font-semibold text-lg mb-2">{widgetData.label}</h3>
      )}

      <div className={`${fontSizeClass} flex-grow w-full`}>
        {format === 'markdown' ? (
          <ReactMarkdown>{text}</ReactMarkdown>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        )}
      </div>
    </div>
  )
}

/**
 * Text Widget Edit Component
 * Provides a form for editing text content and formatting
 */
const TextWidgetEdit: React.FC<WidgetEditProps<TextWidgetProps>> = ({
  widgetData,
  onChange,
}) => {
  // Apply font size classes
  const fontSizeClass =
    {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    }[widgetData.fontSize || 'base'] || 'text-base'

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...widgetData,
      text: e.target.value,
    })
  }

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...widgetData,
      format: e.target.value as 'plain' | 'markdown',
    })
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...widgetData,
      fontSize: e.target.value as TextWidgetProps['fontSize'],
    })
  }

  const handleTextAlignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...widgetData,
      textAlign: e.target.value as TextWidgetProps['textAlign'],
    })
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      label: e.target.value,
    })
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={widgetData.label}
          onChange={handleLabelChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex-grow">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={widgetData.text}
          onChange={handleTextChange}
          className="w-full h-[calc(100%-1.5rem)] border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your text here..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <select
            value={widgetData.format || 'plain'}
            onChange={handleFormatChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="plain">Plain Text</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <select
            value={widgetData.fontSize || 'base'}
            onChange={handleFontSizeChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="xs">Extra Small</option>
            <option value="sm">Small</option>
            <option value="base">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
            <option value="2xl">2XL</option>
            <option value="3xl">3XL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Alignment
          </label>
          <select
            value={widgetData.textAlign || 'left'}
            onChange={handleTextAlignChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justified</option>
          </select>
        </div>
      </div>
    </div>
  )
}

// Create the TextWidget interface implementation
const TextWidget: WidgetComponentInterface<TextWidgetProps> = {
  ViewComponent: TextWidgetView,
  EditComponent: TextWidgetEdit,
}

// Register the text widget
registerWidget<TextWidgetProps>(textWidgetMetadata, TextWidget)

export { TextWidget, TextWidgetView, TextWidgetEdit }
export default TextWidget
