import { useState } from 'react'
import { Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import WidgetData from '../../types/WidgetData'
import WidgetShelf from '../../components/layout/shelf/WidgetShelf'
import GenericWidget from '../../components/widget/GenericWidget'
import Sidebar from '../../components/layout/sidebar/Sidebar'
import GridLayout from "react-grid-layout";

const WidgetPage = () => {
  const availableWidgets = [
    { type: 'text', label: 'Text Widget' },
    { type: 'button', label: 'Button Widget' },
    { type: 'image', label: 'Image Widget' },
    { type: 'audioPlayer', label: 'Audio Player Widget' },
  ]

  const [layout, setLayout] = useState<Layout[]>([])
  const [widgets, setWidgets] = useState<WidgetData[]>([])

  const handleAddWidget = (widgetType: string) => {
    const newWidget: WidgetData = {
      id: `widget-${widgets.length + 1}`,
      type: widgetType,
      content: '',
      // position: { x: 0, y: 0 },
      size: { width: 2, height: 2 }
    }

    const newLayoutItem: Layout = {
      i: newWidget.id,
      x: 0,
      y: Infinity,
      w: 2,
      h: 2,
      minW: 1,
      minH: 1
    }

    setWidgets([...widgets, newWidget])
    setLayout([...layout, newLayoutItem])
  }

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout)
    const updatedWidgets = widgets.map(widget => {
      const layoutItem = newLayout.find(item => item.i === widget.id)
      if (layoutItem) {
        return {
          ...widget,
          position: { x: layoutItem.x, y: layoutItem.y },
          size: { width: layoutItem.w, height: layoutItem.h }
        }
      }
      return widget
    })
    setWidgets(updatedWidgets)
  }

  return (
    <div className="flex h-screen">
      <Sidebar position="left">
        <WidgetShelf widgets={availableWidgets.map(widget => widget.type)} onWidgetSelect={handleAddWidget} />
      </Sidebar>
      
      <div className="flex-1 p-4">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200} // You might want to make this responsive
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
        >
          {widgets.map(widget => (
            <div key={widget.id}>
              <GenericWidget
                {...widget}
                onDelete={(id) => {
                  setWidgets(widgets.filter(w => w.id !== id))
                  setLayout(layout.filter(l => l.i !== id))
                }}
                onContentChange={(id, content) => {
                  setWidgets(widgets.map(w => 
                    w.id === id ? { ...w, content } : w
                  ))
                }}
                onResize={(id) => {
                  setWidgets(widgets.map(w => 
                    w.id === id ? { ...w} : w
                  ))
                }}
              />
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  )
}

export default WidgetPage
