import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactGridLayout, { Layout } from 'react-grid-layout'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import Spinner from '../../components/feedback/Spinner'
import WidgetFactory from '../../components/widget/WidgetFactory'
import Breadcrumb from '../../components/navigation/Breadcrumb'
import BackButton from '../../components/navigation/BackButton'
import { useNavigation } from '../../contexts/NavigationContext'
import { WidgetEditProvider } from '../../contexts/WidgetEditContext'
import {
  getCourseByIdQuery,
  completeCourseQuery,
} from '../../api/course/course.queries'
import { BaseWidgetProps } from '../../types/WidgetTypes'
import {
  getInteractiveWidgets,
  areAllInteractiveWidgetsCompletedCorrectly,
  getInteractiveWidgetCorrectCompletion,
} from '../../utils/widget.utils'
import '../../components/widget/widgets' // Import all widgets
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

interface WidgetContent {
  id: string
  type: string
  label: string
  size: { w: number; h: number }
  position: { x: number; y: number }
  layout?: {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
    static?: boolean
  }
  content: BaseWidgetProps
}

interface GridConfig {
  cols: number
  rowHeight: number
  width: number
  margin: [number, number]
  containerPadding: [number, number]
  compactType: 'vertical' | 'horizontal' | null
}

interface LessonContent {
  lesson?: {
    widgets?: WidgetContent[]
    gridConfig?: GridConfig
  }
}

interface LessonDetails {
  id: number
  title: string
  description: string
  level: number
  content: LessonContent | null
  duration: number
  module_id: number
}

const fetchLessonDetails = async (
  lessonId: string
): Promise<LessonDetails | null> => {
  try {
    const lessonId_num = parseInt(lessonId)
    const course = await getCourseByIdQuery(lessonId_num)

    // Parse content and calculate duration
    let parsedContent: LessonContent | null = null
    let duration = 30

    try {
      if (course.content) {
        parsedContent = JSON.parse(course.content)
        // Estimate duration based on widget count
        if (parsedContent?.lesson?.widgets) {
          duration = Math.max(parsedContent.lesson.widgets.length * 5, 15) // 5 min per widget, min 15 min
        }
      }
    } catch {
      // Fallback to default duration if content is not valid JSON
    }
    const lessonDetails: LessonDetails = {
      id: course.id,
      title: course.name || 'Untitled Lesson',
      description: 'Level ' + (course.level || 1) + ' lesson',
      level: course.level || 1,
      content: parsedContent,
      duration,
      module_id: course.module_id,
    }

    return lessonDetails
  } catch (error) {
    console.error('Error fetching lesson details:', error)
    return null
  }
}

const LessonContentPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const { goToModule } = useNavigation()
  const [lessonDetails, setLessonDetails] = useState<LessonDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({})
  const [canComplete, setCanComplete] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const getLessonDetails = async () => {
      if (!lessonId) {
        setError('Lesson ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const lesson = await fetchLessonDetails(lessonId)

        if (lesson) {
          setLessonDetails(lesson)
          setError(null)
        } else {
          setError('Lesson not found')
        }
      } catch (err) {
        console.error('Failed to fetch lesson details:', err)
        setError('Failed to load lesson details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    getLessonDetails()
  }, [lessonId])

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      const totalScrollableHeight = documentHeight - windowHeight
      const progress = totalScrollableHeight > 0
        ? (scrollTop / totalScrollableHeight) * 100
        : 0

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if all quiz widgets have been answered correctly
  useEffect(() => {
    if (!lessonDetails?.content?.lesson?.widgets) {
      setCanComplete(false)
      return
    }
    const widgets = lessonDetails.content.lesson.widgets
    const interactiveWidgets = getInteractiveWidgets(widgets)

    // If there are no interactive widgets, lesson can be completed immediately
    if (interactiveWidgets.length === 0) {
      setCanComplete(true)
      return
    }

    // Check if all interactive widgets have been answered correctly
    const allCorrect = areAllInteractiveWidgetsCompletedCorrectly(
      widgets,
      quizAnswers
    )

    setCanComplete(allCorrect)
  }, [lessonDetails, quizAnswers])

  // Handle quiz answer callback
  const handleQuizAnswer = (widgetId: string, isCorrect: boolean) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [widgetId]: isCorrect,
    }))
  }

  const handleQuizCompletion = async () => {
    if (!lessonDetails || !canComplete) return

    try {
      setIsCompleting(true)
      // Call the API to mark the lesson as completed
      const result = await completeCourseQuery(lessonDetails.id)

      if (result) {
        // Navigate back to module page
        goToModule(lessonDetails.module_id)
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error)
      alert('Failed to mark lesson as complete. Please try again.')
    } finally {
      setIsCompleting(false)
    }
  }

  const renderLessonContent = () => {
    if (!lessonDetails?.content?.lesson?.widgets) {
      return (
        <div className="text-center py-16 bg-bfbase-lightgrey rounded-lg">
          <h3 className="text-lg text-bfbase-darkgrey mb-2">
            Content Coming Soon
          </h3>
          <p className="text-bfbase-grey">
            This lesson is currently being prepared. Check back later for
            interactive content.
          </p>
        </div>
      )
    }

    const widgets = lessonDetails.content.lesson.widgets
    const gridConfig = lessonDetails.content.lesson.gridConfig

    // Debug log to check widget data structure
    console.log('Widgets data:', widgets)
    console.log('Grid config:', gridConfig)

    // Use the saved layout data if available, otherwise fallback to position/size
    const layout: Layout[] = widgets.map((widget) => {
      if (widget.layout) {
        // Use the exact layout information saved from the editor
        return {
          ...widget.layout,
          static: true, // Make read-only in viewer
        }
      } else {
        // Fallback to old format for backward compatibility
        return {
          i: widget.id,
          x: typeof widget.position.x === 'number' ? widget.position.x : 0,
          y: typeof widget.position.y === 'number' ? widget.position.y : 0,
          w: typeof widget.size.w === 'number' ? widget.size.w : 6,
          h: typeof widget.size.h === 'number' ? widget.size.h : 3,
          static: true,
        }
      }
    })

    // Use saved grid configuration or defaults
    const cols = gridConfig?.cols || 12
    const rowHeight = gridConfig?.rowHeight || 40
    const width = gridConfig?.width || 872
    const margin = gridConfig?.margin || [12, 12]
    const containerPadding = gridConfig?.containerPadding || [0, 0]
    const compactType = gridConfig?.compactType || 'vertical'

    return (
      <div className="bg-white rounded-lg border p-4">
        <div className="max-w-[920px] m-auto py-8">
          <style>
            {`
              /* Hide resize handles in view mode */
              .react-resizable-handle {
                display: none !important;
              }

              /* Remove hover effects on widget containers in view mode */
              .widget-container:hover {
                border-color: transparent !important;
                box-shadow: none !important;
              }

              /* Ensure proper containment without breaking layout */
              .widget-container {
                overflow: hidden;
              }

              /* Allow grid to expand vertically for scrolling */
              .react-grid-layout {
                min-height: auto !important;
              }
            `}
          </style>
          <ReactGridLayout
            className="layout"
            layout={layout}
            cols={cols}
            rowHeight={rowHeight}
            width={width}
            autoSize={true}
            compactType={compactType as 'vertical' | 'horizontal' | null}
            margin={margin}
            containerPadding={containerPadding}
            isBounded={true}
            preventCollision={false}
            isDraggable={false}
            isResizable={false}
          >
            {widgets.map((widget: WidgetContent) => (
              <div key={widget.id} className="widget-container">
                {widget.content && (
                  <WidgetFactory
                    data={widget.content}
                    isEditable={false}
                    isDraggable={false}
                    className="h-full"
                    onQuizAnswer={(isCorrect) =>
                      handleQuizAnswer(widget.id, isCorrect)
                    }
                  />
                )}
              </div>
            ))}
          </ReactGridLayout>
        </div>
      </div>
    )
  }

  return (
    <WidgetEditProvider>
      <div className="flex flex-col min-h-screen">
        {/* Fixed scroll progress bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-full bg-bfgreen-base transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
        <Header />
        <div className="container mx-auto max-w-5xl py-8 px-4 flex-grow">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" className="border-l-bfgreen-base" />
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-bfred-light rounded-lg text-bfred-dark">
              <h2 className="text-xl">{error}</h2>
              <button
                className="mt-4 bg-bfred-dark hover:bg-bfred-base text-white font-medium py-2 px-4 rounded transition-colors"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : lessonDetails ? (
            <>
              {' '}
              <div className="mb-6">
                <Breadcrumb className="mb-4" />
                <div className="flex items-center mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-bfbase-black">
                      {lessonDetails.title}
                    </h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="bg-bfblue-light text-bfblue-base px-3 py-1 rounded-full text-sm font-medium">
                        Level {lessonDetails.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b border-bfbase-lightgrey mb-6"></div>
              {/* Interactive Widget Progress Indicator */}
              {lessonDetails?.content?.lesson?.widgets &&
                (() => {
                  const widgets = lessonDetails.content.lesson.widgets
                  const { completed, total } =
                    getInteractiveWidgetCorrectCompletion(widgets, quizAnswers)

                  if (total === 0) return null

                  const progressPercentage = (completed / total) * 100

                  return (
                    <div className="mb-6 p-4 bg-bfbase-lightgrey rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-bfbase-darkgrey">
                          Progress
                        </h3>
                        <span className="text-sm text-bfbase-grey">
                          {completed} / {total} completed
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-bfgreen-base h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })()}
              {renderLessonContent()}{' '}
              <div className="mt-8 flex justify-between items-center">
                <BackButton
                  fallbackPath={`/lesson/${lessonId}`}
                  label="Back to Lesson Overview"
                />
                <div className="space-x-4">
                  <button
                    disabled={!canComplete || isCompleting}
                    className={`font-medium py-2 px-6 rounded transition-colors ${
                      canComplete && !isCompleting
                        ? 'bg-bfgreen-base hover:bg-bfgreen-dark text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={handleQuizCompletion}
                  >
                    {isCompleting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Completing...
                      </>
                    ) : canComplete ? (
                      'Mark as Complete'
                    ) : (
                      'Complete All Quizzes First'
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <Footer />
      </div>
    </WidgetEditProvider>
  )
}

export default LessonContentPage
