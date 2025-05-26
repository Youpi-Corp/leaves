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
  lastEdited: string
  duration: number
}

interface ModuleDetails {
  id: number
  title: string
  description: string
  lastEdited: string
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
    description: `Level ${course.level || 1} lesson`,
    lastEdited: new Date().toISOString(), // Backend doesn't have lastEdited, use current date
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
      lastEdited: module.dtm || new Date().toISOString(),
      lessons,
    }

    return moduleDetails
  } catch (error) {
    console.error('Error fetching module details:', error)
    return null
  }
}

const ModuleEditionPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const [moduleDetails, setModuleDetails] = useState<ModuleDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)

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

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleCreateLesson = () => {
    navigate(`/edition/editor/`)
  }
  const handleEditLesson = (lessonId: number) => {
    navigate(`/edition/editor/${lessonId}`)
  }

  const handleViewLesson = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`)
  }

  const handleViewModule = () => {
    navigate(`/module/${moduleId}`)
  }

  const handleRenameLesson = (lessonId: number) => {
    console.log(`Rename lesson ${lessonId}`)
  }

  const handleDeleteLesson = (lessonId: number) => {
    console.log(`Delete lesson ${lessonId}`)
  }

  const toggleDropdown = (e: React.MouseEvent, lessonId: number) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === lessonId ? null : lessonId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
                    onClick={() => navigate('/edition/dashboard')}
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
                  <h1 className="text-2xl font-bold text-bfbase-black">
                    {moduleDetails.title}
                  </h1>
                </div>
                <p className="text-bfbase-grey mb-2 md:mb-0 max-w-2xl">
                  {moduleDetails.description}
                </p>
                <p className="text-sm text-bfbase-grey">
                  Last edited: {formatDate(moduleDetails.lastEdited)}
                </p>{' '}
              </div>
              <div className="flex space-x-3">
                <button
                  className="bg-bfbase-lightgrey hover:bg-bfbase-grey text-bfbase-black font-medium py-2 px-4 rounded transition-colors mt-4 md:mt-0"
                  onClick={handleViewModule}
                >
                  View Module
                </button>
                <button
                  className="bg-bfgreen-base hover:bg-bfgreen-dark text-white font-medium py-2 px-4 rounded transition-colors mt-4 md:mt-0"
                  onClick={handleCreateLesson}
                >
                  Create New Lesson
                </button>
              </div>
            </div>

            <div className="border-b border-bfbase-lightgrey mb-6"></div>

            {moduleDetails.lessons.length === 0 ? (
              <div className="text-center py-16 bg-bfbase-lightgrey rounded-lg">
                <h2 className="text-xl text-bfbase-darkgrey">
                  This module doesn&apos;t have any lessons yet.
                </h2>
                <button
                  className="mt-4 bg-bfgreen-base hover:bg-bfgreen-dark text-white font-medium py-2 px-4 rounded transition-colors"
                  onClick={handleCreateLesson}
                >
                  Create Your First Lesson
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {moduleDetails.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="border rounded-lg bg-white p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                    onClick={() => handleViewLesson(lesson.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className="flex items-center justify-center rounded-full bg-bfblue-light w-7 h-7 text-bfblue-base font-semibold text-sm mr-3">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-bfbase-black">
                            {lesson.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-bfbase-grey">
                          {lesson.description}
                        </p>
                      </div>

                      <div className="text-right flex items-start">
                        <div className="mr-4">
                          <span className="text-sm font-medium bg-bfblue-light text-bfblue-base px-2 py-1 rounded-full">
                            {formatDuration(lesson.duration)}
                          </span>
                          <p className="text-xs text-bfbase-grey mt-2">
                            Last edited: {formatDate(lesson.lastEdited)}
                          </p>
                        </div>

                        <div className="relative">
                          <button
                            onClick={(e) => toggleDropdown(e, lesson.id)}
                            className="p-1 rounded-full hover:bg-bfbase-lightgrey transition-colors"
                          >
                            <svg
                              className="w-5 h-5 text-bfbase-grey"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                            </svg>
                          </button>

                          {activeDropdown === lesson.id && (
                            <div
                              className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-bfbase-lightgrey"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {' '}
                              <ul className="py-1">
                                <li>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm text-bfbase-black hover:bg-bfbase-lightgrey"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleViewLesson(lesson.id)
                                    }}
                                  >
                                    View
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm text-bfbase-black hover:bg-bfbase-lightgrey"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditLesson(lesson.id)
                                    }}
                                  >
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm text-bfbase-black hover:bg-bfbase-lightgrey"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRenameLesson(lesson.id)
                                    }}
                                  >
                                    Rename
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm text-bfred-base hover:bg-bfred-light"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteLesson(lesson.id)
                                    }}
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
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

export default ModuleEditionPage
