import React, { useState, useEffect } from 'react'
import {
  BaseWidgetProps,
  WidgetViewProps,
  WidgetEditProps,
  WidgetComponentInterface,
  WidgetMetadata,
} from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'

/**
 * Props for the image widget
 */
export interface ImageWidgetProps extends BaseWidgetProps {
  imageUrl: string
  altText: string // Required for accessibility
  aspectRatio?: 'original' | '1:1' | '4:3' | '16:9'
  caption?: string
}

/**
 * Register ImageWidget props with the registry
 */
declare module '../../../types/WidgetPropsRegistry' {
  interface WidgetPropsRegistry {
    ImageWidget: ImageWidgetProps
  }
}

// Image Widget metadata
const imageWidgetMetadata: WidgetMetadata = {
  type: 'ImageWidget',
  displayName: 'Image',
  description: 'Display images with optional caption and formatting. Upload files from computer or use URLs.',
  icon: 'image',
  category: 'Media',
  version: '1.1.0',
  tags: ['image', 'media', 'photo', 'upload', 'file'],
}

// Define aspect ratio options in a central location to make it easy to extend
const ASPECT_RATIOS = {
  original: {
    label: 'Original',
    class: '',
  },
  '1:1': {
    label: 'Square (1:1)',
    class: 'aspect-square',
  },
  '4:3': {
    label: 'Standard (4:3)',
    class: 'aspect-4/3',
  },
  '16:9': {
    label: 'Widescreen (16:9)',
    class: 'aspect-video',
  },
  // Add new aspect ratios here without modifying the component logic
  // '3:2': {
  //   label: 'Photo (3:2)',
  //   class: 'aspect-3/2'
  // },
  // '21:9': {
  //   label: 'Ultrawide (21:9)',
  //   class: 'aspect-[21/9]'
  // },
}

// Type for valid aspect ratio keys
type AspectRatioType = keyof typeof ASPECT_RATIOS

/**
 * Image Widget View Component
 * Displays an image with optional caption
 */
const ImageWidgetView: React.FC<WidgetViewProps<ImageWidgetProps>> = ({
  widgetData,
}) => {
  const { imageUrl, altText, caption, aspectRatio = 'original' } = widgetData

  // Get aspect ratio class dynamically from the configuration
  const aspectRatioClass =
    ASPECT_RATIOS[aspectRatio as AspectRatioType]?.class || ''

  return (
    <figure className="w-full">
      <div
        className={`w-full overflow-hidden ${
          aspectRatio !== 'original' ? aspectRatioClass : ''
        }`}
      >
        <img
          src={imageUrl}
          alt={altText}
          className={`w-full h-auto ${
            aspectRatio !== 'original' ? 'object-cover' : ''
          }`}
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Image Widget Edit Component
 * Provides a form for editing image properties
 */
const ImageWidgetEdit: React.FC<WidgetEditProps<ImageWidgetProps>> = ({
  widgetData,
  onChange,
  onSave,
  onCancel,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')
  const [validationError, setValidationError] = useState<string>('')

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('')
    onChange({
      ...widgetData,
      imageUrl: e.target.value,
    })
  }

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAltText = e.target.value
    setValidationError('')
    
    onChange({
      ...widgetData,
      altText: newAltText,
    })
  }

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      caption: e.target.value,
    })
  }

  const handleAspectRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...widgetData,
      aspectRatio: e.target.value as ImageWidgetProps['aspectRatio'],
    })
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      label: e.target.value,
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const handleFileUpload = (file: File | null) => {
    if (!file) return

    setUploadError('')

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, GIF, etc.)')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError('Image file is too large. Please select a file smaller than 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        onChange({
          ...widgetData,
          imageUrl: reader.result as string,
        })
      }
    }
    reader.onerror = () => {
      setUploadError('Failed to read the selected file. Please try again.')
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileUpload(file)
  }

  const validateWidget = () => {
    if (!widgetData.altText || widgetData.altText.trim() === '') {
      setValidationError('Alt text is required for accessibility')
      return false
    }
    setValidationError('')
    return true
  }

  const handleSave = () => {
    if (validateWidget()) {
      onSave()
    }
  }

  // Validate on any data change that affects required fields
  useEffect(() => {
    if (widgetData.imageUrl && widgetData.altText && widgetData.altText.trim() !== '') {
      setValidationError('')
    }
  }, [widgetData.altText, widgetData.imageUrl])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={widgetData.label}
          onChange={handleLabelChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
        />
      </div>

      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image
        </label>
        
        {/* Drag and Drop Area */}
        <div
          className={`relative border-dashed border-2 ${
            isDragging ? 'border-bfgreen-base bg-bfgreen-light/10' : 'border-gray-300'
          } p-8 rounded-md text-center transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            
            <div>
              <p className="text-gray-600">
                Drag and drop an image here, or{' '}
                <label className="cursor-pointer text-bfgreen-base hover:text-bfgreen-dark font-medium">
                  browse files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports JPG, PNG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
            {uploadError}
          </div>
        )}
      </div>

      {/* OR Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or enter URL</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          value={widgetData.imageUrl}
          onChange={handleImageUrlChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alt Text
          </label>
          <input
            type="text"
            value={widgetData.altText || ''}
            onChange={handleAltTextChange}
            className={`w-full border rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base ${
              validationError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Screen readers app users need this"
            required
          />
          {validationError && (
            <div className="mt-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 flex items-center">
              <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationError}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aspect Ratio
          </label>
          <select
            value={widgetData.aspectRatio || 'original'}
            onChange={handleAspectRatioChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
          >
            {/* Dynamically generate options from the ASPECT_RATIOS object */}
            {Object.entries(ASPECT_RATIOS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Caption (Optional)
        </label>
        <input
          type="text"
          value={widgetData.caption || ''}
          onChange={handleCaptionChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
          placeholder="Image caption"
        />
      </div>

      {/* Image Preview */}
      {widgetData.imageUrl && (
        <div className="border border-gray-200 p-2 rounded-md">
          <p className="text-xs text-gray-500 mb-1">Aperçu:</p>
          <img
            src={widgetData.imageUrl}
            alt={widgetData.altText}
            className="max-h-40 max-w-full object-contain"
          />
        </div>
      )}

      {/* Validation Alert*/}
      {widgetData.imageUrl && (!widgetData.altText || widgetData.altText.trim() === '') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-medium">
                Missing Alt Text
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Please add alternative text to improve accessibility. This information helps users with screen readers understand the image content.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Create the ImageWidget interface implementation
const ImageWidget: WidgetComponentInterface<ImageWidgetProps> = {
  ViewComponent: ImageWidgetView,
  EditComponent: ImageWidgetEdit,
}

// Register the image widget
registerWidget<ImageWidgetProps>(imageWidgetMetadata, ImageWidget)

export { ImageWidget, ImageWidgetView, ImageWidgetEdit }
export default ImageWidget
