import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid' // You may need to install this package
import { BaseWidgetProps, WidgetMetadata } from '../../types/WidgetTypes'
import { widgetRegistry } from './WidgetRegistry'

interface WidgetPickerProps {
  onWidgetSelect: (widgetData: BaseWidgetProps) => void
  className?: string
}

/**
 * WidgetPicker Component
 * Displays available widgets for users to add to their content
 */
const WidgetPicker: React.FC<WidgetPickerProps> = ({
  onWidgetSelect,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get all widgets metadata
  const widgets = widgetRegistry.getAllWidgetsMetadata()

  // Get unique categories
  const categories = Array.from(
    new Set(widgets.map((widget) => widget.category))
  ).sort()

  // Filter widgets by search query and category
  const filteredWidgets = widgets.filter((widget) => {
    const matchesSearch =
      searchQuery === '' ||
      widget.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (widget.tags &&
        widget.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))

    const matchesCategory =
      selectedCategory === null || widget.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Handle selection of a widget
  const handleWidgetSelect = (widgetType: string) => {
    // Create a new unique ID for this widget instance
    const id = uuidv4()

    // Find the widget metadata
    const metadata = widgets.find((w) => w.type === widgetType)

    if (!metadata) return

    // Create widget data based on type
    switch (widgetType) {
      case 'TextWidget': {
        const widgetData: BaseWidgetProps = {
          id,
          type: widgetType,
          label: metadata.displayName,
          text: 'Enter your text here',
          format: 'plain',
        }
        onWidgetSelect(widgetData)
        break
      }

      case 'ImageWidget': {
        const widgetData: BaseWidgetProps = {
          id,
          type: widgetType,
          label: metadata.displayName,
          imageUrl: 'https://via.placeholder.com/300x200?text=Select+an+image',
          altText: 'Please add alternative text',
        }
        onWidgetSelect(widgetData)
        break
      }

      case 'ListWidget': {
        const widgetData: BaseWidgetProps = {
          id,
          type: widgetType,
          label: metadata.displayName,
          items: ['Item 1', 'Item 2', 'Item 3'],
          ordered: false,
        }
        onWidgetSelect(widgetData)
        break
      }

      case 'MatchingWidget': {
        const widgetData: BaseWidgetProps = {
          id,
          type: widgetType,
          label: metadata.displayName,
          question:
            'Match the items from the left column with the correct items from the right column.',
          leftItems: [
            { id: 'left1', text: 'Left Item 1' },
            { id: 'left2', text: 'Left Item 2' },
          ],
          rightItems: [
            { id: 'right1', text: 'Right Item 1' },
            { id: 'right2', text: 'Right Item 2' },
          ],
          correctMatches: [
            { leftId: 'left1', rightId: 'right1' },
            { leftId: 'left2', rightId: 'right2' },
          ],
          shuffleItems: false,
          showFeedback: true,
          feedback: {
            correct: 'Great job! All matches are correct.',
            incorrect: 'Some matches are incorrect. Please try again.',
          },
        }
        onWidgetSelect(widgetData)
        break
      }

      default: {
        // Default case for widgets without specific props
        const widgetData: BaseWidgetProps = {
          id,
          type: widgetType,
          label: metadata.displayName,
        }
        onWidgetSelect(widgetData)
        break
      }
    }
  }

  return (
    <div className={`widget-picker ${className}`}>
      <div className="p-4 border-b">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search widgets..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 max-h-80 overflow-y-auto">
        {filteredWidgets.map((widget) => (
          <WidgetPickerItem
            key={widget.type}
            widget={widget}
            onSelect={() => handleWidgetSelect(widget.type)}
          />
        ))}

        {filteredWidgets.length === 0 && (
          <div className="col-span-3 p-8 text-center text-gray-500">
            No widgets found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component to display individual widget options
interface WidgetPickerItemProps {
  widget: WidgetMetadata
  onSelect: () => void
}

const WidgetPickerItem: React.FC<WidgetPickerItemProps> = ({
  widget,
  onSelect,
}) => {
  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-2">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Different icons based on widget type */}
          {widget.type === 'TextWidget' && (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          )}
          {widget.type === 'ImageWidget' && (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          )}
          {widget.type === 'ListWidget' && (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          )}
          {/* Add more icon options for other widget types */}
          {!['TextWidget', 'ImageWidget', 'ListWidget'].includes(
            widget.type
          ) && (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          )}
        </svg>
      </div>
      <span className="font-medium text-sm">{widget.displayName}</span>
      <p className="text-xs text-gray-500 mt-1 text-center">
        {widget.description}
      </p>
    </button>
  )
}

export default WidgetPicker
