import React from 'react'
import DraggableWidget from '../../widget/DraggableWidget'

const WidgetShelf = ({ widgets }: { widgets: string[] }) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Widget Shelf</h2>
      {widgets.map((widget, index) => (
        <DraggableWidget
          key={`shelf-${index}`}
          id={`shelf-${index}`}
          content={widget}
        />
      ))}
    </div>
  )
}

export default WidgetShelf
