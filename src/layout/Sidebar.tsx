import React, { FC, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'

interface WidgetMenuItem {
  type: string
  label: string
  description?: string
  icon?: string
  category?: string
}

interface SidebarProps {
  title: string
  position: 'left' | 'right'
  widgets: string[] | WidgetMenuItem[]
  onWidgetSelect: (widgetType: string) => void
}

const Sidebar: FC<SidebarProps> = ({
  title,
  position,
  widgets,
  onWidgetSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Normalize widget data for consistent display
  const normalizedWidgets: WidgetMenuItem[] = widgets.map((widget) =>
    typeof widget === 'string' ? { type: widget, label: widget } : widget
  )

  // Extract categories from widgets
  const categories = [
    'All',
    ...Array.from(
      new Set(normalizedWidgets.map((w) => w.category || 'Uncategorized'))
    ),
  ]

  // Filter widgets by search term and category
  const filteredWidgets = normalizedWidgets.filter((widget) => {
    const matchesSearch =
      widget.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (widget.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || widget.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group widgets by category for display
  const widgetsByCategory: Record<string, WidgetMenuItem[]> = {}
  filteredWidgets.forEach((widget) => {
    const category = widget.category || 'Uncategorized'
    if (!widgetsByCategory[category]) {
      widgetsByCategory[category] = []
    }
    widgetsByCategory[category].push(widget)
  })

  // Display style based on whether we have rich widget data or just strings
  const hasRichWidgetData = normalizedWidgets.some(
    (w) => w.description || w.icon || w.category
  )

  return (
    <div
      className={`fixed top-0 h-screen w-72 bg-white shadow-lg flex flex-col ${
        position === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="font-bold text-xl text-neutral-700">{title}</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search widgets..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Tabs - Only shown if we have category data */}
      {hasRichWidgetData && categories.length > 1 && (
        <div className="p-2 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 mr-1 text-sm rounded-full ${
                selectedCategory === category
                  ? 'bg-bfgreen-light text-bfgreen-dark'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Widgets List */}
      <div className="flex-1 overflow-y-auto p-4">
        {hasRichWidgetData ? (
          // Rich widget display with categories
          selectedCategory === 'All' ? (
            // Show all categories when "All" is selected
            Object.entries(widgetsByCategory).map(
              ([category, categoryWidgets]) => (
                <div key={category} className="mb-6">
                  <h2 className="text-sm font-medium text-gray-500 mb-2">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 gap-2">
                    {categoryWidgets.map((widget) => (
                      <button
                        key={widget.type}
                        className="flex items-start p-3 bg-white rounded-lg border border-gray-200 hover:border-bfgreen-base hover:bg-bfgreen-light transition-colors text-left"
                        onClick={() => onWidgetSelect(widget.type)}
                      >
                        <div className="flex-shrink-0 mr-3 mt-1 bg-bfgreen-light rounded-md p-2 text-bfgreen-dark">
                          {widget.icon ? (
                            // Use provided icon if available (would need an icon library or custom component)
                            <span>{widget.icon}</span>
                          ) : (
                            <FaPlus size={16} />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{widget.label}</div>
                          {widget.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {widget.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )
          ) : (
            // Show just the selected category
            <div className="grid grid-cols-1 gap-2">
              {filteredWidgets.map((widget) => (
                <button
                  key={widget.type}
                  className="flex items-start p-3 bg-white rounded-lg border border-gray-200 hover:border-bfgreen-base hover:bg-bfgreen-light transition-colors text-left"
                  onClick={() => onWidgetSelect(widget.type)}
                >
                  <div className="flex-shrink-0 mr-3 mt-1 bg-bfgreen-light rounded-md p-2 text-bfgreen-dark">
                    {widget.icon ? (
                      <span>{widget.icon}</span>
                    ) : (
                      <FaPlus size={16} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{widget.label}</div>
                    {widget.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {widget.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          // Simple widget display for backward compatibility
          <div className="grid grid-cols-2 gap-2">
            {filteredWidgets.map((widget) => (
              <button
                key={widget.type}
                className="p-3 bg-white rounded-lg border border-gray-200 hover:border-bfgreen-base hover:bg-bfgreen-light transition-colors text-center"
                onClick={() => onWidgetSelect(widget.type)}
              >
                {widget.label}
              </button>
            ))}
          </div>
        )}

        {filteredWidgets.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No widgets found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
