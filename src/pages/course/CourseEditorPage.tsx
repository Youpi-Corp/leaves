import React from 'react'
import { useState } from 'react'
import { Layout } from 'react-grid-layout'
import WidgetData from '../../types/WidgetData'
import ReactGridLayout from 'react-grid-layout'
import WidgetFactory from '../../components/widget/WidgetFactory'
import { getAvailableWidgetTypes } from '../../components/widget/WidgetRegistry'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { DndContext } from '@dnd-kit/core'
import Sidebar from '../../layout/Sidebar'
import {
  TextWidgetProps,
  ImageWidgetProps,
  ListWidgetProps,
} from '../../types/WidgetTypes'

// S'assurer que les widgets sont importés pour être enregistrés
import '../../components/widget/widgets/WidgetText'
import '../../components/widget/widgets/WidgetImage'
import '../../components/widget/widgets/WidgetList'

const CourseEditorPage = () => {
  // Récupérer dynamiquement les types de widgets disponibles
  const availableWidgetTypes = getAvailableWidgetTypes().map((type) => ({
    type,
    label: `${type.replace('Widget', '')} Widget`,
  }))

  const [layout, setLayout] = useState<Layout[]>([])
  const [widgets, setWidgets] = useState<WidgetData[]>([])

  const getDefaultWidgetProps = (
    widgetType: string
  ): Partial<TextWidgetProps | ImageWidgetProps | ListWidgetProps> => {
    switch (widgetType) {
      case 'TextWidget':
        return {
          text: 'Nouveau texte',
        }
      case 'ImageWidget':
        return {
          imageUrl: 'https://via.placeholder.com/350x150',
        }
      case 'ListWidget':
        return {
          items: ['Premier élément', 'Second élément', 'Troisième élément'],
          ordered: false,
        }
      default:
        return {}
    }
  }

  const handleAddWidget = (widgetType: string) => {
    const widgetId = `widget-${widgets.length + 1}`

    const newWidget: WidgetData = {
      id: widgetId,
      type: widgetType,
      label: `${widgetType.replace('Widget', '')} ${widgets.length + 1}`,
      content: '',
      position: { x: 0, y: 0 },
      size: { width: 2, height: 2 },
      ...getDefaultWidgetProps(widgetType),
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
            <div className="max-w-[920px] bg-white shadow-md h-full m-auto rounded-xl flex flex-col flex-grow items-start justify-start flex-1 overflow-clip">
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
                    {WidgetFactory(widget.type, widget)}
                  </div>
                ))}
              </ReactGridLayout>
            </div>
          </div>
        </div>
        <Sidebar
          position="right"
          title="Modules"
          widgets={availableWidgetTypes.map((widget) => widget.type)}
          onWidgetSelect={handleAddWidget}
        />
      </div>
    </DndContext>
  )
}

export default CourseEditorPage
