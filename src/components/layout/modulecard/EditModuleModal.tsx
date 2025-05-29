import React, { useState, useEffect } from 'react'
import {
  updateModuleQuery,
  ModuleCreateData,
  Module,
} from '../../../api/module/module.queries'

interface EditModuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedModule: Module) => void
  module: Module | null
}

const EditModuleModal: React.FC<EditModuleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  module,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update form when module changes
  useEffect(() => {
    if (module && isOpen) {
      setTitle(module.title || '')
      setDescription(module.description || '')
      setIsPublic(module.public)
      setError(null)
    }
  }, [module, isOpen])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !module) {
      return
    }
    try {
      setIsUpdating(true)
      setError(null)

      const moduleData: Partial<ModuleCreateData> = {
        title: title.trim(),
        description: description.trim() || undefined,
        public: isPublic,
      }

      const updatedModule = await updateModuleQuery(module.id, moduleData) // Call success callback with the updated module
      onSuccess(updatedModule)

      // Note: Parent component will handle closing the modal
    } catch (err) {
      console.error('Failed to update module:', err)
      setError('Failed to update module. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-bfbase-black mb-4">
          Edit Module
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-bfred-light text-bfred-dark rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="moduleTitle"
              className="block text-sm font-medium text-bfbase-grey mb-1"
            >
              Title*
            </label>
            <input
              id="moduleTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-bfbase-lightgrey rounded focus:ring-2 focus:ring-bfgreen-light focus:border-bfgreen-base outline-none transition-all"
              placeholder="Enter module title"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="moduleDescription"
              className="block text-sm font-medium text-bfbase-grey mb-1"
            >
              Description
            </label>
            <textarea
              id="moduleDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-bfbase-lightgrey rounded focus:ring-2 focus:ring-bfgreen-light focus:border-bfgreen-base outline-none transition-all"
              placeholder="Enter module description"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mr-2 h-4 w-4 text-bfgreen-base focus:ring-bfgreen-light border-bfbase-lightgrey rounded transition-colors"
              />
              <span className="text-sm text-bfbase-grey">
                Make this module public
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-bfbase-lightgrey text-bfbase-grey rounded hover:bg-bfbase-lightgrey transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isUpdating}
              className={`px-4 py-2 rounded text-white ${
                !title.trim() || isUpdating
                  ? 'bg-bfgreen-light cursor-not-allowed'
                  : 'bg-bfgreen-base hover:bg-bfgreen-dark cursor-pointer'
              } transition-colors`}
            >
              {isUpdating ? 'Updating...' : 'Update Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditModuleModal
