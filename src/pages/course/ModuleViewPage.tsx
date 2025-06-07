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
import {
  useModuleSubscription,
  useSubscribeToModule,
  useUnsubscribeFromModule,
} from '../../api/module/module.services'
import { useCurrentUser } from '../../api/user/user.services'
import { isCourseCompletedQuery } from '../../api/course/course.queries'

interface Lesson {
  id: number
  title: string
  description: string
  level: number
  duration: number
  isCompleted?: boolean
}

interface ModuleDetails {
  id: number
  title: string
  description: string
  lessons: Lesson[]
}

// Helper function to convert API Course to frontend Lesson format
const courseToLesson = (course: Course, isCompleted:boolean = false): Lesson => {
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
    isCompleted,
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

    // Fetch completion status for each course
    const lessonCompletionPromises = courses.map(async (course) => {
      try {
        const isCompleted = await isCourseCompletedQuery(course.id)
        return courseToLesson(course, isCompleted)
      } catch (error) {
        console.error(
          `Failed to fetch completion status for course ${course.id}:`,
          error
        )
        // If we can't fetch completion status, default to false
        return courseToLesson(course, false)
      }
    })

    const lessons = await Promise.all(lessonCompletionPromises)

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

  // User and subscription hooks
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()
  const moduleIdNumber = moduleId ? parseInt(moduleId) : 0
  const { data: isSubscribed, isLoading: isSubscriptionLoading } =
    useModuleSubscription(moduleIdNumber)
  const subscribeToModule = useSubscribeToModule()
  const unsubscribeFromModule = useUnsubscribeFromModule()

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
    // Check if user is authenticated and subscribed before allowing lesson access
    if (!currentUser) {
      navigate('/login')
      return
    }

    if (!isSubscribed) {
      // Show subscription required message or prompt
      return
    }

    navigate(`/lesson/${lessonId}`)
  }

  const handleSubscriptionToggle = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    if (!moduleIdNumber) return

    try {
      if (isSubscribed) {
        await unsubscribeFromModule.mutateAsync(moduleIdNumber)
      } else {
        await subscribeToModule.mutateAsync(moduleIdNumber)
      }
    } catch (err) {
      console.error('Subscription action failed:', err)
      setError('Failed to update subscription. Please try again.')
    }
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

  const getCompletionStats = () => {
    if (!moduleDetails?.lessons) return { completed: 0, total: 0, percentage: 0 }
    const completed = moduleDetails.lessons.filter(lesson => lesson.isCompleted).length
    const total = moduleDetails.lessons.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }

  // Add this after the module description and before the lessons count
  const completionStats = getCompletionStats()

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
            {' '}
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

                {/* Progress Stats */}
                {completionStats.total > 0 && (
                  <div className="mt-4 mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-bfbase-grey">
                        Progress: {completionStats.completed}/{completionStats.total} lessons completed
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {completionStats.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${completionStats.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subscription Button */}
              <div className="mt-4 md:mt-0">
                {currentUser && !isUserLoading && !isSubscriptionLoading && (
                  <button
                    onClick={handleSubscriptionToggle}
                    disabled={
                      subscribeToModule.isPending ||
                      unsubscribeFromModule.isPending
                    }
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isSubscribed
                        ? 'bg-bfred-light text-bfred-base hover:bg-bfred-base hover:text-white border border-bfred-base'
                        : 'bg-bfgreen-base text-white hover:bg-bfgreen-dark'
                    } ${
                      subscribeToModule.isPending ||
                      unsubscribeFromModule.isPending
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {subscribeToModule.isPending ||
                    unsubscribeFromModule.isPending ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </div>
                    ) : isSubscribed ? (
                      'Unsubscribe'
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                )}
                {!currentUser && !isUserLoading && (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-bfgreen-base text-white rounded-lg font-medium hover:bg-bfgreen-dark transition-colors"
                  >
                    Login to Subscribe
                  </button>
                )}
              </div>
            </div>
            <div className="border-b border-bfbase-lightgrey mb-6"></div>{' '}
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

                {/* Subscription required notice */}
                {currentUser && !isSubscribed && !isSubscriptionLoading && (
                  <div className="bg-bfyellow-light border border-bfyellow-base rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-bfyellow-base mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <p className="text-bfyellow-dark">
                        <strong>Subscription Required:</strong> You need to
                        subscribe to this module to access the lessons.
                      </p>
                    </div>
                  </div>
                )}

                {/* Lessons list */}
                {moduleDetails.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`border rounded-lg bg-white p-6 transition-all ${
                      lesson.isCompleted 
                        ? 'border-green-300 bg-green-50' // Green styling for completed lessons
                        : ''
                    } ${
                      currentUser && isSubscribed
                        ? 'hover:shadow-md cursor-pointer hover:border-bfgreen-base'
                        : currentUser && !isSubscribed
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:shadow-md cursor-pointer hover:border-bfgreen-base'
                    }`}
                    onClick={() => {
                      if (!currentUser || isSubscribed) {
                        handleLessonClick(lesson.id)
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center mb-2">
                          <span className={`flex items-center justify-center rounded-full w-8 h-8 font-semibold text-sm mr-3 ${
                            lesson.isCompleted
                              ? 'bg-green-500 text-white' // Green circle for completed lessons
                              : 'bg-bfgreen-light text-bfgreen-base'
                          }`}>
                            {lesson.isCompleted ? (
                              // Checkmark icon for completed lessons
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              index + 1
                            )}
                          </span>
                          <h3 className={`text-lg font-semibold ${
                            lesson.isCompleted ? 'text-green-700' : 'text-bfbase-black'
                          }`}>
                            {lesson.title}
                          </h3>
                          {lesson.isCompleted && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Completed
                            </span>
                          )}
                          {currentUser && !isSubscribed && (
                            <svg
                              className="w-5 h-5 text-bfyellow-base ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          )}
                        </div>
                        <p className={`mt-2 pl-11 ${
                          lesson.isCompleted ? 'text-green-600' : 'text-bfbase-grey'
                        }`}>
                          {lesson.description}
                        </p>
                      </div>

                      <div className="text-right flex items-center space-x-4">
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            lesson.isCompleted 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-bfblue-light text-bfblue-base'
                          }`}>
                            Level {lesson.level}
                          </span>
                          <span className={`text-sm ${
                            lesson.isCompleted ? 'text-green-600' : 'text-bfbase-grey'
                          }`}>
                            {formatDuration(lesson.duration)}
                          </span>
                        </div>
                        <svg
                          className={`w-5 h-5 ${
                            lesson.isCompleted ? 'text-green-500' : 'text-bfbase-grey'
                          }`}
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
