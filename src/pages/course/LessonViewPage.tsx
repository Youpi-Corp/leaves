import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import Spinner from '../../components/feedback/Spinner'
import { getCourseByIdQuery } from '../../api/course/course.queries'
import { BaseWidgetProps } from '../../types/WidgetTypes'

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
    }

    return lessonDetails
  } catch (error) {
    console.error('Error fetching lesson details:', error)
    return null
  }
}

const LessonViewPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const [lessonDetails, setLessonDetails] = useState<LessonDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`
  }

  const renderLessonOverview = () => {
    const widgetCount = lessonDetails?.content?.lesson?.widgets?.length || 0

    return (
      <div className="space-y-6">
        {' '}
        <h3 className="text-xl font-semibold text-bfbase-black mb-4">
          What You&apos;ll Learn
        </h3>
        <div className="bg-white rounded-lg border p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-bfbase-black mb-3">
                Lesson Overview
              </h4>
              <ul className="space-y-2 text-bfbase-grey">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-bfgreen-base"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Interactive learning experience
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-bfgreen-base"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {widgetCount} interactive components
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-bfgreen-base"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Hands-on practice activities
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-bfgreen-base"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Self-paced learning
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-bfbase-black mb-3">
                Learning Objectives
              </h4>
              <ul className="space-y-2 text-bfbase-grey">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-bfblue-base rounded-full mt-2 mr-3"></span>
                  Master key concepts for Level {lessonDetails?.level}
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-bfblue-base rounded-full mt-2 mr-3"></span>
                  Apply knowledge through practical exercises
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-bfblue-base rounded-full mt-2 mr-3"></span>
                  Build confidence in your understanding
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-bfblue-base rounded-full mt-2 mr-3"></span>
                  Prepare for the next level of learning
                </li>
              </ul>
            </div>
          </div>
        </div>
        {widgetCount === 0 && (
          <div className="bg-bfbase-lightgrey rounded-lg p-6 text-center">
            <h4 className="text-lg text-bfbase-darkgrey mb-2">
              Content Coming Soon
            </h4>
            <p className="text-bfbase-grey">
              This lesson is currently being prepared. Check back later for
              interactive content.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
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
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-3 text-bfbase-grey hover:text-bfbase-black transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-bfbase-black">
                    {lessonDetails.title}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="bg-bfblue-light text-bfblue-base px-3 py-1 rounded-full text-sm font-medium">
                      Level {lessonDetails.level}
                    </span>
                    <span className="flex items-center text-sm text-bfbase-grey">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDuration(lessonDetails.duration)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-bfbase-grey max-w-3xl">
                {lessonDetails.description}
              </p>
            </div>{' '}
            <div className="border-b border-bfbase-lightgrey mb-6"></div>
            {renderLessonOverview()}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-bfbase-lightgrey hover:bg-bfbase-grey text-bfbase-black font-medium py-2 px-6 rounded transition-colors"
              >
                Back to Module
              </button>

              <div className="space-x-4">
                <button
                  onClick={() =>
                    navigate(`/lesson/${lessonDetails.id}/content`)
                  }
                  className="bg-bfgreen-base hover:bg-bfgreen-dark text-white font-medium py-2 px-6 rounded transition-colors"
                >
                  Start Lesson
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
      <Footer />
    </div>
  )
}

export default LessonViewPage
