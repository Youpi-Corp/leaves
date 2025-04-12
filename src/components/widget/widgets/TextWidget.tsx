import React, { useState } from 'react'
import {
  BaseWidgetProps,
  TextWidgetProps,
  WidgetViewProps,
  WidgetEditProps,
  WidgetComponentInterface,
  WidgetMetadata,
} from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'
import ReactMarkdown from 'react-markdown'

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
  onSave,
  onCancel,
}) => {
  const [previewEnabled, setPreviewEnabled] = useState(false)

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

      {/* Preview toggle */}
      {widgetData.format === 'markdown' && (
        <div className="flex items-center pt-2">
          <button
            type="button"
            onClick={() => setPreviewEnabled(!previewEnabled)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            {previewEnabled ? (
              <>
                <svg
                  className="w-4 h-4 mr-1"
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
                Edit Content
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview
              </>
            )}
          </button>
        </div>
      )}

      {/* Markdown Preview */}
      {previewEnabled && widgetData.format === 'markdown' && (
        <div className="mt-2 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className={`prose max-w-none ${fontSizeClass}`}>
            <ReactMarkdown>{widgetData.text}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Removed duplicate save/cancel buttons */}
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
