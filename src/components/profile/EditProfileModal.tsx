import React, { useState, useRef } from 'react'
import { User } from '../../api/types/user.types'
import { useUpdateProfile } from '../../api/user/user.services'
import Modal from '../feedback/Modal'

interface EditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [pseudo, setPseudo] = useState(user.pseudo || '')
  const [biography, setBiography] = useState(user.biography || '')
  const [profilePicture, setProfilePicture] = useState(
    user.profile_picture || ''
  )
  const [previewUrl, setPreviewUrl] = useState(user.profile_picture || '')
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const updateProfileMutation = useUpdateProfile()
  const [isLoading, setIsLoading] = useState(false)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Define maximum file size (2MB = 2 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 2 * 1024 * 1024

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        'File size exceeds 2MB limit. Please choose a smaller image.'
      )
      return
    }

    // Reset error if a valid file is selected
    setFileError(null)

    // Read the file as a data URL (base64)
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      setProfilePicture(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateProfileMutation.mutateAsync({
        pseudo,
        biography,
        profile_picture: profilePicture,
      })
      onClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl w-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Profile Picture
            </label>
            <div className="flex flex-col items-center mb-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-4xl text-gray-400">
                    {pseudo.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Choose Image
              </button>
              {fileError && (
                <p className="text-red-500 text-sm mt-2">{fileError}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="biography"
              className="block text-gray-700 font-medium mb-2"
            >
              Biography
            </label>
            <textarea
              id="biography"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-bfgreen-base text-white rounded hover:bg-bfgreen-dark disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default EditProfileModal
