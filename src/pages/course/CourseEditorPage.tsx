import React from 'react'
import { useState } from 'react'
import Sidebar from '../../layout/sidebar/Sidebar'
import { Layout } from 'react-grid-layout'
import WidgetData from '../../types/WidgetData'
import ReactGridLayout from 'react-grid-layout'
import WidgetFactory from '../../components/widget/WidgetFactory'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { DndContext } from '@dnd-kit/core'

const CourseEditorPage = () => {
  const availableWidgets = [
    { type: 'TextWidget', label: 'Text Widget' },
    { type: 'ImageWidget', label: 'Image Widget' },
  ]

  const [layout, setLayout] = useState<Layout[]>([])
  const [widgets, setWidgets] = useState<WidgetData[]>([])

  const handleAddWidget = (widgetType: string) => {
    const newWidget: WidgetData = {
      id: `widget-${widgets.length + 1}`,
      type: widgetType,
      content: '',
      position: { x: 0, y: 0 },
      size: { width: 2, height: 2 },
    }

    const newLayoutItem: Layout = {
      i: newWidget.id,
      x: 0,
      y: Infinity,
      w: 2,
      h: 2,
      minW: 1,
      minH: 1,
    }

    setWidgets([...widgets, newWidget])
    setLayout([...layout, newLayoutItem])
  }

  return (
    <DndContext>
      <div
        className={`flex w-full h-screen items-center justify-center bg-[url(./assets/graph-paper.svg)]`}
      >
        <div className="flex w-full h-full">
          <div className="p-4 w-full">
            <div className="max-w-[920px] bg-white shadow-md h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto">
              <ReactGridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={30}
                width={920}
                onLayoutChange={(newLayout) => setLayout(newLayout)}
              >
                {widgets.map((widget) => (
                  <div key={widget.id}>
                    {WidgetFactory(widget.type, {
                      label: widget.type,
                      text: widget.content || 'New widget',
                    })}
                  </div>
                ))}
              </ReactGridLayout>
            </div>
          </div>
        </div>
        <Sidebar
          position="right"
          title="Modules"
          widgets={availableWidgets.map((widget) => widget.type)}
          onWidgetSelect={handleAddWidget}
        />
      </div>
    </DndContext>
  )
}

export default CourseEditorPage
