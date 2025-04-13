import React, { useState } from 'react'
import {
  BaseWidgetProps,
  WidgetViewProps,
  WidgetEditProps,
  WidgetComponentInterface,
  WidgetMetadata,
} from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'

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
 * Register ListWidget props with the registry
 */
declare module '../../../types/WidgetPropsRegistry' {
  interface WidgetPropsRegistry {
    ListWidget: ListWidgetProps
  }
}

// List Widget metadata
const listWidgetMetadata: WidgetMetadata = {
  type: 'ListWidget',
  displayName: 'List',
  description: 'Create ordered or unordered lists with customizable styles',
  icon: 'list',
  category: 'Content',
  version: '1.0.0',
  tags: ['list', 'bullet', 'content', 'ordered'],
}

/**
 * List Widget View Component
 * Displays a list of items, either ordered or unordered
 */
const ListWidgetView: React.FC<WidgetViewProps<ListWidgetProps>> = ({
  widgetData,
}) => {
  const {
    items,
    ordered = false,
    bulletStyle = 'disc',
    startNumber = 1,
  } = widgetData

  // If there are no items, show placeholder message
  if (!items || items.length === 0) {
    return <p className="text-gray-500 italic">Empty list</p>
  }

  // Determine the list style class
  let listStyleClass = 'pl-5 space-y-1'

  if (ordered) {
    listStyleClass += ' list-decimal'
  } else {
    switch (bulletStyle) {
      case 'disc':
        listStyleClass += ' list-disc'
        break
      case 'circle':
        listStyleClass += ' list-circle'
        break
      case 'square':
        listStyleClass += ' list-square'
        break
      case 'none':
        listStyleClass += ' list-none'
        break
      default:
        listStyleClass += ' list-disc'
    }
  }

  const ListComponent = ordered ? 'ol' : 'ul'

  return (
    <ListComponent
      className={listStyleClass}
      start={ordered ? startNumber : undefined}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ListComponent>
  )
}

/**
 * List Widget Edit Component
 * Provides a form for editing list properties and items
 */
const ListWidgetEdit: React.FC<WidgetEditProps<ListWidgetProps>> = ({
  widgetData,
  onChange,
}) => {
  const [newItem, setNewItem] = useState('')

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      label: e.target.value,
    })
  }

  const handleOrderedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      ordered: e.target.checked,
    })
  }

  const handleBulletStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...widgetData,
      bulletStyle: e.target.value as 'disc' | 'circle' | 'square' | 'none',
    })
  }

  const handleStartNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    onChange({
      ...widgetData,
      startNumber: isNaN(value) ? 1 : value,
    })
  }

  const handleAddItem = () => {
    if (!newItem.trim()) return

    // Create a new items array with the new item added
    const newItems = [...(widgetData.items || []), newItem.trim()]

    // Update the widget data
    onChange({
      ...widgetData,
      items: newItems,
    })

    // Clear the input
    setNewItem('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddItem()
    }
  }

  const handleDeleteItem = (index: number) => {
    const newItems = [...widgetData.items]
    newItems.splice(index, 1)
    onChange({
      ...widgetData,
      items: newItems,
    })
  }

  const handleEditItem = (index: number, value: string) => {
    const newItems = [...widgetData.items]
    newItems[index] = value
    onChange({
      ...widgetData,
      items: newItems,
    })
  }

  const handleMoveItemUp = (index: number) => {
    if (index === 0) return
    const newItems = [...widgetData.items]
    const item = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = item
    onChange({
      ...widgetData,
      items: newItems,
    })
  }

  const handleMoveItemDown = (index: number) => {
    if (index === widgetData.items.length - 1) return
    const newItems = [...widgetData.items]
    const item = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = item
    onChange({
      ...widgetData,
      items: newItems,
    })
  }

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            id="ordered-list"
            type="checkbox"
            checked={widgetData.ordered || false}
            onChange={handleOrderedChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="ordered-list"
            className="ml-2 block text-sm text-gray-700"
          >
            Ordered List
          </label>
        </div>

        {widgetData.ordered ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Number
            </label>
            <input
              type="number"
              min="1"
              value={widgetData.startNumber || 1}
              onChange={handleStartNumberChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bullet Style
            </label>
            <select
              value={widgetData.bulletStyle || 'disc'}
              onChange={handleBulletStyleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={widgetData.ordered}
            >
              <option value="disc">Disc</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="none">None</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          List Items
        </label>
        <div className="space-y-2">
          {widgetData.items && widgetData.items.length > 0 ? (
            widgetData.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleEditItem(index, e.target.value)}
                  className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => handleMoveItemUp(index)}
                    disabled={index === 0}
                    className={`p-1 rounded ${
                      index === 0
                        ? 'text-gray-300'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Move up"
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
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveItemDown(index)}
                    disabled={index === widgetData.items.length - 1}
                    className={`p-1 rounded ${
                      index === widgetData.items.length - 1
                        ? 'text-gray-300'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Move down"
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="Delete item"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No items in the list</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new item..."
          className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
    </div>
  )
}

// Create the ListWidget interface implementation
const ListWidget: WidgetComponentInterface<ListWidgetProps> = {
  ViewComponent: ListWidgetView,
  EditComponent: ListWidgetEdit,
}

// Register the list widget
registerWidget<ListWidgetProps>(listWidgetMetadata, ListWidget)

export { ListWidget, ListWidgetView, ListWidgetEdit }
export default ListWidget
