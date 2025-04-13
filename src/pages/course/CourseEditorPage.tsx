import React, { useState } from 'react'
import { Layout } from 'react-grid-layout'
import ReactGridLayout from 'react-grid-layout'
import { v4 as uuidv4 } from 'uuid'
import { DndContext } from '@dnd-kit/core'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import Sidebar from '../../layout/Sidebar'
import { widgetRegistry } from '../../components/widget/WidgetRegistry'
import WidgetFactory from '../../components/widget/WidgetFactory'
import {
  BaseWidgetProps,
  TextWidgetProps,
  ImageWidgetProps,
  ListWidgetProps,
  CodeWidgetProps,
} from '../../types/WidgetTypes'

// Ensure widgets are imported for registration
import '../../components/widget/widgets'

const CourseEditorPage = () => {
  // Get all available widget types from the registry
  const availableWidgetTypes = widgetRegistry
    .getAllWidgetsMetadata()
    .map((metadata) => ({
      type: metadata.type,
      label: metadata.displayName,
      description: metadata.description,
      icon: metadata.icon,
      category: metadata.category,
    }))

  const [layout, setLayout] = useState<Layout[]>([])
  const [widgets, setWidgets] = useState<BaseWidgetProps[]>([])

  // Define default widget sizes based on type
  const getWidgetDefaultSize = (
    widgetType: string
  ): { w: number; h: number } => {
    switch (widgetType) {
      case 'TextWidget':
        return { w: 6, h: 3 }
      case 'ImageWidget':
        return { w: 6, h: 4 }
      case 'ListWidget':
        return { w: 6, h: 4 }
      case 'CodeWidget':
        return { w: 8, h: 5 }
      default:
        return { w: 6, h: 3 } // Default size for unknown widget types
    }
  }

  // Create default props for new widgets based on type
  const getDefaultWidgetProps = (
    widgetType: string
  ): Partial<BaseWidgetProps> => {
    switch (widgetType) {
      case 'TextWidget':
        return {
          text: 'New text content',
          format: 'plain',
          fontSize: 'base',
          textAlign: 'left',
        } as Partial<TextWidgetProps>
      case 'ImageWidget':
        return {
          imageUrl: 'https://via.placeholder.com/350x150',
          altText: 'Placeholder image',
          aspectRatio: 'original',
        } as Partial<ImageWidgetProps>
      case 'ListWidget':
        return {
          items: ['First item', 'Second item', 'Third item'],
          ordered: false,
          bulletStyle: 'disc',
        } as Partial<ListWidgetProps>
      case 'CodeWidget':
        return {
          code: '// Your code here\nconsole.log("Hello world!");',
          language: 'javascript',
          showLineNumbers: true,
          theme: 'light',
        } as Partial<CodeWidgetProps>
      default:
        return {}
    }
  }

  // Add a new widget to the page
  const handleAddWidget = (widgetType: string) => {
    const widgetId = uuidv4()
    const metadata = widgetRegistry
      .getAllWidgetsMetadata()
      .find((m) => m.type === widgetType)

    if (!metadata) {
      console.error(`Widget type ${widgetType} not found in registry`)
      return
    }

    const newWidget: BaseWidgetProps = {
      id: widgetId,
      type: widgetType,
      label: metadata.displayName,
      ...getDefaultWidgetProps(widgetType),
    }

    // Get appropriate default size for this widget type
    const defaultSize = getWidgetDefaultSize(widgetType)

    const newLayoutItem: Layout = {
      i: widgetId,
      x: 0,
      y: Infinity, // Put at the end
      w: defaultSize.w, // Use type-specific width
      h: defaultSize.h, // Use type-specific height
      minW: 2, // Smaller minimum width
      minH: 2, // Smaller minimum height
    }

    setWidgets([...widgets, newWidget])
    setLayout([...layout, newLayoutItem])
  }

  // Handle widget updates
  const handleUpdateWidget = (id: string, updatedData: BaseWidgetProps) => {
    setWidgets(
      widgets.map((widget) => (widget.id === id ? updatedData : widget))
    )
  }

  // Handle widget deletion
  const handleDeleteWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id))
    setLayout(layout.filter((item) => item.i !== id))
  }

  return (
    <DndContext>
      <div className="flex w-full h-screen items-center justify-center bg-[url(./assets/graph-paper.svg)]">
        <div className="flex w-full h-full">
          <div className="p-4 w-full">
            <div className="max-w-[920px] bg-white shadow-md h-full m-auto rounded-xl flex flex-col">
              <div className="w-full px-4 flex-1 relative">
                <ReactGridLayout
                  className="layout h-full"
                  layout={layout}
                  cols={12}
                  rowHeight={40} // Reduced row height for finer control
                  width={872} // 920px - 2*padding (24px)
                  autoSize={true}
                  onLayoutChange={(newLayout) => setLayout(newLayout)}
                  compactType="vertical"
                  margin={[12, 12]} // Reduced margins between widgets
                  containerPadding={[0, 0]}
                  isBounded={true}
                  preventCollision={false}
                  draggableHandle=".widget-drag-handle"
                  draggableCancel=".widget-content"
                  resizeHandles={['se', 'sw', 'ne', 'nw', 'e', 'w', 's', 'n']} // Allow resizing from all sides
                >
                  {widgets.map((widget) => (
                    <div key={widget.id} className="widget-container h-full">
                      <WidgetFactory
                        data={widget}
                        onUpdate={handleUpdateWidget}
                        onDelete={handleDeleteWidget}
                        className="h-full"
                      />
                    </div>
                  ))}
                </ReactGridLayout>

                {widgets.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 absolute inset-0 flex flex-col items-center justify-center">
                    <svg
                      className="w-16 h-16 mb-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h2 className="text-xl font-medium mb-2">No widgets yet</h2>
                    <p className="max-w-sm mx-auto">
                      Start building your course by adding widgets from the
                      sidebar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Sidebar
          position="right"
          title="Widgets"
          widgets={availableWidgetTypes}
          onWidgetSelect={handleAddWidget}
        />
      </div>
    </DndContext>
  )
}

export default CourseEditorPage
