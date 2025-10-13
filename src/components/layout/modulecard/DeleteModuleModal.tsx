import React, { useState, useEffect } from 'react'
import { Module, deleteModuleQuery } from '../../../api/module/module.queries'
import Modal from '../../feedback/Modal'

interface DeleteModuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  module: Module | null
}

const DeleteModuleModal: React.FC<DeleteModuleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  module,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setError(null)
    }
  }, [isOpen])

  const handleDelete = async () => {
    if (!module?.id) return
    try {
      setIsDeleting(true)
      setError(null)

      await deleteModuleQuery(module.id)
      onSuccess()
    } catch {
      setError('Failed to delete module. Please try again.')
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-bfbase-black">
              Delete Module
            </h2>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-bfred-light text-bfred-dark rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm text-bfbase-grey mb-4">
            Are you sure you want to delete this module? This action cannot be
            undone.
          </p>

          {module && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-bfbase-black mb-2">
                Module Details:
              </h3>
              <div className="space-y-2">
                {' '}
                <div>
                  <span className="text-sm font-medium text-bfbase-grey">
                    Title:
                  </span>
                  <p className="text-sm text-bfbase-black font-semibold">
                    &quot;{module.title}&quot;
                  </p>
                </div>
                {module.description && (
                  <div>
                    <span className="text-sm font-medium text-bfbase-grey">
                      Description:
                    </span>
                    <p className="text-sm text-bfbase-black">
                      {module.description}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-bfbase-grey">
                    Courses:
                  </span>
                  <p className="text-sm text-bfbase-black">
                    {module.courses_count || 0} course
                    {(module.courses_count || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-bfbase-grey">
                    Visibility:
                  </span>
                  <p className="text-sm text-bfbase-black">
                    {module.public ? 'Public' : 'Private'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">
              ⚠️ Warning: All courses and content within this module will be
              permanently deleted.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-bfbase-lightgrey text-bfbase-grey rounded hover:bg-bfbase-lightgrey transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 rounded text-white flex items-center ${
              isDeleting
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 cursor-pointer'
            } transition-colors`}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Deleting...
              </>
            ) : (
              'Delete Module'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteModuleModal
