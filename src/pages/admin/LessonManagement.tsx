import React, { useState, useMemo } from 'react'
import { FaTrash, FaEye, FaLock, FaUnlock, FaSearch } from 'react-icons/fa'
import {
  useAdminLessons,
  useDeleteLesson,
} from '../../api/admin/admin.services'
import Spinner from '../../components/feedback/Spinner'

const LessonManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: lessons, isLoading, error } = useAdminLessons()
  const deleteLessonMutation = useDeleteLesson()

  // Filter lessons based on search term
  const filteredLessons = useMemo(() => {
    if (!lessons || !searchTerm) return lessons || []

    return lessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.id.toString().includes(searchTerm) ||
        lesson.owner_id.toString().includes(searchTerm)
    )
  }, [lessons, searchTerm])

  const handleDeleteLesson = async (lessonId: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this lesson? This action cannot be undone.'
      )
    ) {
      try {
        await deleteLessonMutation.mutateAsync(lessonId)
      } catch (error) {
        console.error('Failed to delete lesson:', error)
      }
    }
  }

  const handleViewLesson = (lessonId: number) => {
    window.open(`/lesson/${lessonId}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading lessons. Please try again.</p>
      </div>
    )
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lesson Management</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredLessons?.length || 0} lessons
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search lessons by title, content, ID, or owner ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bfgreen-base focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredLessons.length} lesson(s) matching &ldquo;
            {searchTerm}&rdquo;
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lesson
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>{' '}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLessons?.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lesson.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {lesson.content
                          ? `${lesson.content.substring(0, 100)}...`
                          : 'No content'}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {lesson.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lesson.public
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {lesson.public ? (
                        <>
                          <FaUnlock className="w-3 h-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <FaLock className="w-3 h-3 mr-1" />
                          Private
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    User ID: {lesson.owner_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lesson.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewLesson(lesson.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Lesson"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Lesson"
                        disabled={deleteLessonMutation.isPending}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>{' '}
        {filteredLessons?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>
              {searchTerm
                ? 'No lessons found matching your search.'
                : 'No lessons found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonManagement
