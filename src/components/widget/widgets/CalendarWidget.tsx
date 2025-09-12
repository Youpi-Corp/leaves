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
 * Define the props for the Calendar widget
 * This extends BaseWidgetProps from the core widget system
 */
export interface CalendarWidgetProps extends BaseWidgetProps {
  view: 'month' | 'week' | 'day' | 'agenda'
  selectedDate: string // ISO date string
  events?: Array<{
    id: string
    title: string
    start: string // ISO date string
    end?: string // ISO date string
    color?: string
    description?: string
  }>
  showWeekends?: boolean
  firstDayOfWeek?: 0 | 1 | 6 // 0 = Sunday, 1 = Monday, 6 = Saturday
}

/**
 * Use module augmentation to register the Calendar widget props
 * This allows TypeScript to know about our widget props without modifying WidgetTypes.ts
 */
declare module '../../../types/WidgetPropsRegistry' {
  interface WidgetPropsRegistry {
    CalendarWidget: CalendarWidgetProps
  }
}

/**
 * Calendar Widget metadata for the widget registry
 */
const calendarWidgetMetadata: WidgetMetadata = {
  type: 'CalendarWidget',
  displayName: 'Calendar',
  description: 'Display dates and events in various calendar views',
  icon: 'calendar',
  category: 'Planning',
  version: '1.0.0',
  tags: ['calendar', 'event', 'schedule', 'planning'],
}

/**
 * Helper function to format a date string
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Calendar Widget View Component
 */
const CalendarWidgetView: React.FC<WidgetViewProps<CalendarWidgetProps>> = ({
  widgetData,
}) => {
  const { label, view = 'month', selectedDate, events = [] } = widgetData

  // In a real implementation, this would use a proper calendar component
  // For this example, we'll just show a simple representation
  return (
    <div className="w-full h-full flex flex-col">
      {label && <h3 className="font-semibold text-lg mb-2">{label}</h3>}

      <div className="flex justify-between items-center mb-4">
        <div className="font-medium">{formatDate(selectedDate)}</div>
        <div className="text-sm bg-bfgreen-light text-bfgreen-dark px-2 py-1 rounded">
          {view.charAt(0).toUpperCase() + view.slice(1)} View
        </div>
      </div>

      <div className="border rounded p-4 flex-grow bg-white">
        {events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event) => (
              <li
                key={event.id}
                className="p-2 border-l-4 rounded"
                style={{ borderColor: event.color || '#5fbb63' }}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-gray-500">
                  {formatDate(event.start)}
                  {event.end && ` - ${formatDate(event.end)}`}
                </div>
                {event.description && (
                  <div className="text-sm mt-1">{event.description}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No events scheduled
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Calendar Widget Edit Component
 */
const CalendarWidgetEdit: React.FC<WidgetEditProps<CalendarWidgetProps>> = ({
  widgetData,
  onChange,
}) => {
  const [showEventForm, setShowEventForm] = useState(false)
  const [currentEvent, setCurrentEvent] = useState({
    id: '',
    title: '',
    start: new Date().toISOString().split('T')[0],
    end: '',
    color: '#5fbb63',
    description: '',
  })

  // Handle label change
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      label: e.target.value,
    })
  }

  // Handle view change
  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...widgetData,
      view: e.target.value as CalendarWidgetProps['view'],
    })
  }

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      selectedDate: e.target.value,
    })
  }

  // Handle weekend toggle
  const handleWeekendsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      showWeekends: e.target.checked,
    })
  }

  // Handle first day of week change
  const handleFirstDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...widgetData,
      firstDayOfWeek: parseInt(
        e.target.value
      ) as CalendarWidgetProps['firstDayOfWeek'],
    })
  }

  // Handle adding an event
  const handleAddEvent = () => {
    const newEvent = {
      ...currentEvent,
      id: Date.now().toString(),
    }

    onChange({
      ...widgetData,
      events: [...(widgetData.events || []), newEvent],
    })

    setCurrentEvent({
      id: '',
      title: '',
      start: new Date().toISOString().split('T')[0],
      end: '',
      color: '#5fbb63',
      description: '',
    })

    setShowEventForm(false)
  }

  // Handle removing an event
  const handleRemoveEvent = (eventId: string) => {
    onChange({
      ...widgetData,
      events: widgetData.events?.filter((event) => event.id !== eventId) || [],
    })
  }

  // Handle event form field changes
  const handleEventChange = (field: string, value: string) => {
    setCurrentEvent({
      ...currentEvent,
      [field]: value,
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
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            View
          </label>
          <select
            value={widgetData.view || 'month'}
            onChange={handleViewChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selected Date
          </label>
          <input
            type="date"
            value={
              widgetData.selectedDate?.split('T')[0] ||
              new Date().toISOString().split('T')[0]
            }
            onChange={handleDateChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Day of Week
          </label>
          <select
            value={widgetData.firstDayOfWeek?.toString() || '0'}
            onChange={handleFirstDayChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
          >
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="6">Saturday</option>
          </select>
        </div>

        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            id="showWeekends"
            checked={widgetData.showWeekends !== false}
            onChange={handleWeekendsChange}
            className="h-4 w-4 text-bfgreen-dark border-gray-300 rounded focus:ring-bfgreen-base"
          />
          <label
            htmlFor="showWeekends"
            className="ml-2 block text-sm text-gray-700"
          >
            Show Weekends
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-700">Events</h4>
          <button
            type="button"
            onClick={() => setShowEventForm(true)}
            className="text-sm text-bfgreen-dark hover:text-bfgreen-dark flex items-center"
            disabled={showEventForm}
          >
            + Add Event
          </button>
        </div>

        {/* Event form */}
        {showEventForm && (
          <div className="mt-2 border border-gray-200 rounded-md p-3 bg-gray-50">
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={currentEvent.title}
                onChange={(e) => handleEventChange('title', e.target.value)}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={currentEvent.start}
                  onChange={(e) => handleEventChange('start', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={currentEvent.end || ''}
                  onChange={(e) => handleEventChange('end', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={currentEvent.color || '#5fbb63'}
                onChange={(e) => handleEventChange('color', e.target.value)}
                className="w-full h-8 p-0 border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={currentEvent.description || ''}
                onChange={(e) =>
                  handleEventChange('description', e.target.value)
                }
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowEventForm(false)}
                className="px-2 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddEvent}
                disabled={!currentEvent.title || !currentEvent.start}
                className="px-2 py-1 text-xs text-white bg-bfgreen-base border border-transparent rounded-md hover:bg-bfgreen-dark focus:outline-none focus:ring-2 focus:ring-bfgreen-base disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Events list */}
        {!showEventForm && (
          <div className="mt-2 border border-gray-200 rounded-md divide-y">
            {widgetData.events && widgetData.events.length > 0 ? (
              widgetData.events.map((event) => (
                <div
                  key={event.id}
                  className="p-2 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: event.color || '#5fbb63' }}
                    />
                    <div>
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(event.start)}
                        {event.end && ` - ${formatDate(event.end)}`}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEvent(event.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove event"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No events added yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Create the CalendarWidget interface implementation
const CalendarWidget: WidgetComponentInterface<CalendarWidgetProps> = {
  ViewComponent: CalendarWidgetView,
  EditComponent: CalendarWidgetEdit,
}

// Register the calendar widget
registerWidget<CalendarWidgetProps>(calendarWidgetMetadata, CalendarWidget)

export { CalendarWidget, CalendarWidgetView, CalendarWidgetEdit }
export default CalendarWidget
