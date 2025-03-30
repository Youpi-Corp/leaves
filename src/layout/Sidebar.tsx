import React, { FC } from 'react'

interface SidebarProps {
  title: string
  position: 'left' | 'right'
  widgets: string[]
  onWidgetSelect: (widgetType: string) => void
}

const Sidebar: FC<SidebarProps> = ({
  title,
  position,
  widgets,
  onWidgetSelect,
}) => {
  return (
    <div
      className={`fixed top-0 h-screen w-64 bg-white shadow-lg p-4 ${
        position === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      <h1 className="font-bold text-neutral-700">{title}</h1>
      <div className="border-t border-gray-200 my-2"></div>
      <div className="grid grid-cols-2 gap-4">
        {widgets.map((widget, index) => (
          <button
            key={`shelf-${index}`}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-center"
            onClick={() => onWidgetSelect(widget)}
          >
            {widget}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
