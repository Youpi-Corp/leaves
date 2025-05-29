import React from 'react'
import { useUserModules } from '../../../api/module/module.services'
import Spinner from '../../../components/feedback/Spinner'

interface ExportSidebarProps {
  lessonName: string
  setLessonName: (name: string) => void
  moduleId: number | null
  setModuleId: (id: number | null) => void
  level: number
  setLevel: (level: number) => void
  isPublic: boolean
  setIsPublic: (isPublic: boolean) => void
  onExport: () => void
  isExporting: boolean
  exportError: string | null
  exportSuccess: boolean
  isEditMode?: boolean
}

const ExportSidebar: React.FC<ExportSidebarProps> = ({
  lessonName,
  setLessonName,
  moduleId,
  setModuleId,
  level,
  setLevel,
  isPublic,
  setIsPublic,
  onExport,
  isExporting,
  exportError,
  exportSuccess,
  isEditMode = false,
}) => {
  const { data: modules, isLoading, error } = useUserModules()

  return (
    <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow-lg flex flex-col overflow-hidden">
      {' '}
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="font-bold text-xl text-neutral-700">
          {isEditMode ? 'Update Lesson' : 'Export Lesson'}
        </h1>
      </div>
      {/* Export Form */}
      <div className="flex-1 overflow-y-auto p-4">
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
              Module
            </label>
            {isLoading ? (
              <div className="flex justify-center py-2">
                <Spinner size="sm" className="border-l-blue-500" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">Failed to load modules</div>
            ) : modules && modules.length > 0 ? (
              <select
                value={moduleId || ''}
                onChange={(e) => setModuleId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select a module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title || 'Untitled Module'}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-gray-500 text-sm p-2 border border-gray-200 rounded-md bg-gray-50">
                No modules available. Create a module first.
              </div>
            )}
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
            <label
              htmlFor="isPublic"
              className="ml-2 block text-sm text-gray-700"
            >
              Public
            </label>
          </div>
          {exportError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
              {exportError}
            </div>
          )}{' '}
          {exportSuccess && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
              {isEditMode
                ? 'Lesson updated successfully!'
                : 'Lesson exported successfully!'}
            </div>
          )}
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            onClick={onExport}
            disabled={isExporting || !lessonName || !moduleId}
          >
            {isExporting
              ? isEditMode
                ? 'Updating...'
                : 'Exporting...'
              : isEditMode
              ? 'Update Lesson'
              : 'Export Lesson'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportSidebar
