import React, { useState } from 'react'
import {
  createModuleQuery,
  ModuleCreateData,
  Module,
} from '../../../api/module/module.queries'
import Modal from '../../feedback/Modal'

interface CreateModuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newModule: Module) => void
}

const CreateModuleModal: React.FC<CreateModuleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      return
    }

    try {
      setIsCreating(true)
      setError(null)

      const moduleData: ModuleCreateData = {
        title: title.trim(),
        description: description.trim() || undefined,
        public: isPublic,
      }

      const newModule = await createModuleQuery(moduleData)

      // Reset form
      setTitle('')
      setDescription('')
      setIsPublic(false)

      // Call success callback with the new module
      onSuccess(newModule)
    } catch (err) {
      console.error('Failed to create module:', err)
      setError('Failed to create module. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-bold text-bfbase-black mb-4">
          Create New Module
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
            {' '}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-bfbase-lightgrey text-bfbase-grey rounded hover:bg-bfbase-lightgrey transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isCreating}
              className={`px-4 py-2 rounded text-white ${
                !title.trim() || isCreating
                  ? 'bg-bfgreen-light cursor-not-allowed'
                  : 'bg-bfgreen-base hover:bg-bfgreen-dark cursor-pointer'
              } transition-colors`}
            >
              {isCreating ? 'Creating...' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default CreateModuleModal
