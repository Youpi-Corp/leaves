import React, { useState } from 'react'
import { Layout } from 'react-grid-layout'
import ReactGridLayout from 'react-grid-layout'
import { v4 as uuidv4 } from 'uuid'
import { DndContext } from '@dnd-kit/core'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import Sidebar from '../../../layout/Sidebar'
import { widgetRegistry } from '../../../components/widget/WidgetRegistry'
import WidgetFactory from '../../../components/widget/WidgetFactory'
import { BaseWidgetProps } from '../../../types/WidgetTypes'
import { createCourseQuery } from '../../../api/course/course.queries'

import '../../../components/widget/widgets'

const CourseEditorPage = () => {

  const [layout, setLayout] = useState<Layout[]>([])
  const [widgets, setWidgets] = useState<BaseWidgetProps[]>([])
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)
  const [lessonName, setLessonName] = useState('')
  const [moduleId, setModuleId] = useState(1)
  const [level, setLevel] = useState(1)
  const [isPublic, setIsPublic] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState(false)

  const exportLesson = async () => {
    setExportError(null)
    setExportSuccess(false)
    setIsExporting(true)

    try {
      const widgetContent = widgets.map((widget) => {
        const layoutItem = layout.find((item) => item.i === widget.id)
  
        return {
          id: widget.id,
          type: widget.type,
          label: widget.label,
          size: { w: layoutItem?.w || 6, h: layoutItem?.h || 3 },
          position: { x: layoutItem?.x || 0, y: layoutItem?.y || 0 },
          content: { ...widget }
        }
      })

      const lessonData = {
        name: lessonName,
        content: JSON.stringify({ lesson: { widgets: widgetContent } }),
        module_id: moduleId,
        level: level,
        public: isPublic
      }

      const response = await createCourseQuery(lessonData)
      
      console.log('Lesson query status:', response)
      setExportSuccess(true)
    } catch (error) {
      console.error('Failed to export lesson:', error)
      setExportError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsExporting(false)
    }
  }

  const availableWidgetTypes = widgetRegistry
    .getAllWidgetsMetadata()
    .map((metadata) => ({
      type: metadata.type,
      label: metadata.displayName,
      description: metadata.description,
      icon: metadata.icon,
      category: metadata.category,
    }))

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
        return { w: 6, h: 3 }
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
    }

    const defaultSize = getWidgetDefaultSize(widgetType)

    const newLayoutItem: Layout = {
      i: widgetId,
      x: 0,
      y: Infinity,
      w: defaultSize.w,
      h: defaultSize.h,
      minW: 2,
      minH: 2,
    }

    setWidgets([...widgets, newWidget])
    setLayout([...layout, newLayoutItem])
  }

  const handleUpdateWidget = (id: string, updatedData: BaseWidgetProps) => {
    setWidgets(
      widgets.map((widget) => (widget.id === id ? updatedData : widget))
    )
  }

  const handleDeleteWidget = (id: string) => {
    if (selectedWidgetId === id) {
      setSelectedWidgetId(null)
    }
    setWidgets(widgets.filter((widget) => widget.id !== id))
    setLayout(layout.filter((item) => item.i !== id))
  }

  const handleWidgetSelect = (id: string) => {
    setSelectedWidgetId(selectedWidgetId === id ? null : id)
  }

  const getWidgetClassNames = (widgetId: string) => {
    return `widget-container h-full ${
      selectedWidgetId === widgetId ? 'widget-selected' : 'widget-not-selected'
    }`
  }

  return (
    <div>
    <DndContext>
      <div className="flex w-full h-screen items-center justify-center bg-[url(./assets/graph-paper.svg)]">
        <div className="flex w-full h-full">
          <style>
            {`
            /* Hide resize handles for widgets that are not selected */
            .widget-not-selected .react-resizable-handle {
              display: none !important;
              }
              `}
          </style>
          <div className="p-4 w-full">
            <div className="max-w-[920px] bg-white shadow-md h-full m-auto rounded-xl flex flex-col">
              <div className="w-full px-4 flex-1 relative">
                <ReactGridLayout
                  className="layout h-full"
                  layout={layout}
                  cols={12}
                  rowHeight={40}
                  width={872}
                  autoSize={true}
                  onLayoutChange={(newLayout) => setLayout(newLayout)}
                  compactType="vertical"
                  margin={[12, 12]}
                  containerPadding={[0, 0]}
                  isBounded={true}
                  preventCollision={false}
                  draggableHandle=".widget-drag-handle"
                  draggableCancel=".widget-content"
                  resizeHandles={['se', 'sw', 'ne', 'nw', 'e', 'w', 's', 'n']}
                  >
                  {widgets.map((widget) => (
                    <div
                    key={widget.id}
                    className={getWidgetClassNames(widget.id)}
                    >
                      <WidgetFactory
                        data={widget}
                        onUpdate={handleUpdateWidget}
                        onDelete={handleDeleteWidget}
                        onSelect={() => handleWidgetSelect(widget.id)}
                        isSelected={selectedWidgetId === widget.id}
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
    <div className="m-4 p-4 bg-white rounded-md shadow">
      <h2 className="text-xl font-medium mb-4">Export Lesson</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Name
          </label>
          <input
            type="text"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter lesson name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Module ID
          </label>
          <input
            type="number"
            value={moduleId}
            onChange={(e) => setModuleId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            min="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            min="1"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Public
          </label>
        </div>
        
        {exportError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md">
            {exportError}
          </div>
        )}
        
        {exportSuccess && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md">
            Lesson exported successfully!
          </div>
        )}
        
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={exportLesson}
          disabled={isExporting || !lessonName}
        >
          {isExporting ? 'Exporting...' : 'Export Lesson'}
        </button>
      </div>
    </div>
  </div>
  )
}

export default CourseEditorPage
