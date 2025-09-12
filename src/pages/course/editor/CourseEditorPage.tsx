import React, { useState, useEffect } from 'react'
import { Layout } from 'react-grid-layout'
import ReactGridLayout from 'react-grid-layout'
import { v4 as uuidv4 } from 'uuid'
import { DndContext } from '@dnd-kit/core'
import { useParams, useNavigate } from 'react-router-dom'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import Sidebar from '../../../layout/Sidebar'
import ExportSidebar from './ExportSidebar'
import { widgetRegistry } from '../../../components/widget/WidgetRegistry'
import WidgetFactory from '../../../components/widget/WidgetFactory'
import { BaseWidgetProps } from '../../../types/WidgetTypes'
import { WidgetEditProvider, useWidgetEdit } from '../../../contexts/WidgetEditContext'
import {
  createCourseQuery,
  updateCourseQuery,
  getCourseByIdQuery,
} from '../../../api/course/course.queries'

import '../../../components/widget/widgets'

// Type definitions for course content parsing
interface StoredLayoutData {
  i?: string
  x?: number
  y?: number
  w?: number
  h?: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

interface StoredPositionData {
  x?: number
  y?: number
}

interface StoredSizeData {
  w?: number
  h?: number
}

interface StoredWidgetData {
  id?: string
  type: string
  label?: string
  content?: Record<string, unknown>
  layout?: StoredLayoutData
  position?: StoredPositionData
  size?: StoredSizeData
  [key: string]: unknown
}

const CourseEditorPageContent = () => {
  const { lessonId } = useParams<{ lessonId?: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(lessonId)
  const { openEditModal } = useWidgetEdit()

  const [layout, setLayout] = useState<Layout[]>([])
  const [widgets, setWidgets] = useState<BaseWidgetProps[]>([])
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)
  const [lessonName, setLessonName] = useState('')
  const [moduleId, setModuleId] = useState<number | null>(null)
  const [level, setLevel] = useState(1)
  const [isPublic, setIsPublic] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load existing course data when in edit mode
  useEffect(() => {
    const loadCourseData = async () => {
      if (!isEditMode || !lessonId) return

      try {
        setIsLoading(true)
        const course = await getCourseByIdQuery(parseInt(lessonId))
        // Set basic course data
        setLessonName(course.name || '')
        setModuleId(course.module_id || null)
        setLevel(course.level || 1)
        setIsPublic(course.public || false)

        // Parse content and restore widgets and layout
        if (course.content) {
          try {
            const contentData = JSON.parse(course.content)
            if (contentData.lesson?.widgets) {
              const courseWidgets: BaseWidgetProps[] = []
              const courseLayout: Layout[] = []

              contentData.lesson.widgets.forEach(
                (widgetData: StoredWidgetData) => {
                  // Restore widget data
                  const widget: BaseWidgetProps = {
                    id: widgetData.id || uuidv4(),
                    type: widgetData.type,
                    label:
                      widgetData.label ||
                      ((widgetData.content as Record<string, unknown>)
                        ?.label as string) ||
                      '',
                    ...(widgetData.content as Record<string, unknown>),
                  }
                  courseWidgets.push(widget)

                  // Restore layout data
                  const layoutItem: Layout = {
                    i: widget.id,
                    x: widgetData.layout?.x || widgetData.position?.x || 0,
                    y: widgetData.layout?.y || widgetData.position?.y || 0,
                    w: widgetData.layout?.w || widgetData.size?.w || 6,
                    h: widgetData.layout?.h || widgetData.size?.h || 3,
                    minW: widgetData.layout?.minW || 2,
                    minH: widgetData.layout?.minH || 2,
                    maxW: widgetData.layout?.maxW,
                    maxH: widgetData.layout?.maxH,
                  }
                  courseLayout.push(layoutItem)
                }
              )

              setWidgets(courseWidgets)
              setLayout(courseLayout)
            }
          } catch (parseError) {
            console.error('Error parsing course content:', parseError)
            setExportError('Error loading course content')
          }
        }
      } catch (error) {
        console.error('Error loading course:', error)
        setExportError('Failed to load course data')
      } finally {
        setIsLoading(false)
      }
    }

    loadCourseData()
  }, [isEditMode, lessonId])
  const exportLesson = async () => {
    setExportError(null)
    setExportSuccess(false)
    setIsExporting(true)

    if (!moduleId) {
      setExportError('Please select a module')
      setIsExporting(false)
      return
    }
    try {
      const widgetContent = widgets.map((widget) => {
        const layoutItem = layout.find((item) => item.i === widget.id)

        return {
          id: widget.id,
          type: widget.type,
          label: widget.label,
          size: {
            w: layoutItem?.w || 6,
            h: layoutItem?.h || 3,
          },
          position: {
            x: layoutItem?.x || 0,
            y: layoutItem?.y || 0,
          },
          layout: {
            // Store complete layout information for exact reproduction
            i: widget.id,
            x: layoutItem?.x || 0,
            y: layoutItem?.y || 0,
            w: layoutItem?.w || 6,
            h: layoutItem?.h || 3,
            minW: layoutItem?.minW || 2,
            minH: layoutItem?.minH || 2,
            maxW: layoutItem?.maxW,
            maxH: layoutItem?.maxH,
            static: false, // Will be set to true in viewer
          },
          content: { ...widget },
        }
      })

      // Include grid configuration for consistent reproduction
      const lessonData = {
        name: lessonName,
        content: JSON.stringify({
          lesson: {
            widgets: widgetContent,
            gridConfig: {
              cols: 12,
              rowHeight: 40,
              width: 872,
              margin: [12, 12],
              containerPadding: [0, 0],
              compactType: 'vertical',
            },
          },
        }),
        module_id: moduleId,
        level: level,
        public: isPublic,
      }

      let response
      if (isEditMode && lessonId) {
        // Update existing course
        response = await updateCourseQuery(parseInt(lessonId), lessonData)
      } else {
        // Create new course
        response = await createCourseQuery(lessonData)
      }

      console.log('Lesson operation status:', response)
      setExportSuccess(true)
    } catch (error) {
      console.error('Failed to save lesson:', error)
      setExportError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
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

    const updatedWidgets = [...widgets, newWidget]
    const updatedLayout = [...layout, newLayoutItem]
    
    setWidgets(updatedWidgets)
    setLayout(updatedLayout)
    
    // Automatically open the edit modal for the newly added widget
    openEditModal(newWidget, (updatedWidget: BaseWidgetProps) => {
      // Update the widget in the list when saved from the edit modal
      setWidgets(prevWidgets => 
        prevWidgets.map((widget) =>
          widget.id === widgetId ? updatedWidget : widget
        )
      )
    })
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

  const handleBack = () => {
    navigate(-1) // Navigate back to previous page
  }

  return (
      <div className="h-screen overflow-hidden">
        <DndContext>
        <div className="flex w-full h-full bg-[url(./assets/graph-paper.svg)]">
          {' '}
          <ExportSidebar
            lessonName={lessonName}
            setLessonName={setLessonName}
            moduleId={moduleId}
            setModuleId={setModuleId}
            level={level}
            setLevel={setLevel}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            onExport={exportLesson}
            isExporting={isExporting}
            exportError={exportError}
            exportSuccess={exportSuccess}
            isEditMode={isEditMode}
            onBack={handleBack}
          />{' '}
          {isLoading ? (
            <div className="flex w-full h-full pl-72 pr-72 items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bfgreen-base mx-auto mb-4"></div>
                <p className="text-gray-600">Loading lesson...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex w-full h-full pl-72 pr-72">
                {/* Added padding to accommodate both sidebars */}
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
                        resizeHandles={[
                          'se',
                          'sw',
                          'ne',
                          'nw',
                          'e',
                          'w',
                          's',
                          'n',
                        ]}
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
                          <h2 className="text-xl font-medium mb-2">
                            No widgets yet
                          </h2>
                          <p className="max-w-sm mx-auto">
                            Start building your course by adding widgets from
                            the sidebar.{' '}
                          </p>
                        </div>
                      )}{' '}
                    </div>{' '}
                  </div>
                </div>
              </div>
              <Sidebar
                position="right"
                title="Widgets"
                widgets={availableWidgetTypes}
                onWidgetSelect={handleAddWidget}
              />
            </>
          )}
        </div>
      </DndContext>
    </div>
  )
}

const CourseEditorPage = () => {
  return (
    <WidgetEditProvider>
      <CourseEditorPageContent />
    </WidgetEditProvider>
  )
}

export default CourseEditorPage
