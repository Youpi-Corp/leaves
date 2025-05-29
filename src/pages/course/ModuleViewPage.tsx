import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import Spinner from '../../components/feedback/Spinner'
import {
  getModuleByIdQuery,
  getModuleCoursesQuery,
  Course,
} from '../../api/module/module.queries'

interface Lesson {
  id: number
  title: string
  description: string
  level: number
  duration: number
}

interface ModuleDetails {
  id: number
  title: string
  description: string
  lessons: Lesson[]
}

// Helper function to convert API Course to frontend Lesson format
const courseToLesson = (course: Course): Lesson => {
  // Extract duration from content if available, otherwise default to 30 minutes
  let duration = 30
  try {
    if (course.content) {
      const content = JSON.parse(course.content)
      // If the content has a lesson with widgets, estimate duration based on widget count
      if (content.lesson?.widgets) {
        duration = Math.max(content.lesson.widgets.length * 5, 15) // 5 min per widget, min 15 min
      }
    }
  } catch {
    // Fallback to default duration if content is not valid JSON
  }
  return {
    id: course.id,
    title: course.name || 'Untitled Lesson',
    description: 'Level ' + (course.level || 1) + ' lesson',
    level: course.level || 1,
    duration,
  }
}

const fetchModuleDetails = async (
  moduleId: string
): Promise<ModuleDetails | null> => {
  try {
    const moduleId_num = parseInt(moduleId)

    // Fetch module and its courses in parallel
    const [module, courses] = await Promise.all([
      getModuleByIdQuery(moduleId_num),
      getModuleCoursesQuery(moduleId_num),
    ])

    // Convert courses to lessons
    const lessons = courses.map(courseToLesson)

    const moduleDetails: ModuleDetails = {
      id: module.id,
      title: module.title || 'Untitled Module',
      description: module.description || 'No description available',
      lessons,
    }

    return moduleDetails
  } catch (error) {
    console.error('Error fetching module details:', error)
    return null
  }
}

const ModuleViewPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const [moduleDetails, setModuleDetails] = useState<ModuleDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getModuleDetails = async () => {
      if (!moduleId) {
        setError('Module ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const module = await fetchModuleDetails(moduleId)

        if (module) {
          setModuleDetails(module)
          setError(null)
        } else {
          setError('Module not found')
        }
      } catch (err) {
        console.error('Failed to fetch module details:', err)
        setError('Failed to load module details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    getModuleDetails()
  }, [moduleId])

  const handleLessonClick = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`)
  }

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

  const getTotalDuration = () => {
    if (!moduleDetails?.lessons) return 0
    return moduleDetails.lessons.reduce(
      (total, lesson) => total + lesson.duration,
      0
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto max-w-7xl py-8 px-4 flex-grow">
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
        ) : moduleDetails ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <button
                    onClick={() => navigate('/')}
                    className="mr-2 text-bfbase-grey hover:text-bfbase-black transition-colors"
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
                  <h1 className="text-3xl font-bold text-bfbase-black">
                    {moduleDetails.title}
                  </h1>
                </div>
                <p className="text-bfbase-grey mb-4 max-w-3xl text-lg">
                  {moduleDetails.description}
                </p>
                <div className="flex items-center space-x-6 text-sm text-bfbase-grey">
                  <span className="flex items-center">
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    {moduleDetails.lessons.length} lessons
                  </span>
                  <span className="flex items-center">
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
                    {formatDuration(getTotalDuration())} total
                  </span>
                </div>
              </div>
            </div>

            <div className="border-b border-bfbase-lightgrey mb-6"></div>

            {moduleDetails.lessons.length === 0 ? (
              <div className="text-center py-16 bg-bfbase-lightgrey rounded-lg">
                <h2 className="text-xl text-bfbase-darkgrey">
                  This module doesn&apos;t have any lessons yet.
                </h2>
                <p className="text-bfbase-grey mt-2">
                  Check back later for content updates.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-bfbase-black mb-4">
                  Lessons
                </h2>
                {moduleDetails.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="border rounded-lg bg-white p-6 hover:shadow-md transition-all cursor-pointer hover:border-bfgreen-base"
                    onClick={() => handleLessonClick(lesson.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center mb-2">
                          <span className="flex items-center justify-center rounded-full bg-bfgreen-light w-8 h-8 text-bfgreen-base font-semibold text-sm mr-3">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-bfbase-black">
                            {lesson.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-bfbase-grey pl-11">
                          {lesson.description}
                        </p>
                      </div>

                      <div className="text-right flex items-center space-x-4">
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-sm font-medium bg-bfblue-light text-bfblue-base px-3 py-1 rounded-full">
                            Level {lesson.level}
                          </span>
                          <span className="text-sm text-bfbase-grey">
                            {formatDuration(lesson.duration)}
                          </span>
                        </div>
                        <svg
                          className="w-5 h-5 text-bfbase-grey"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
      <Footer />
    </div>
  )
}

export default ModuleViewPage
