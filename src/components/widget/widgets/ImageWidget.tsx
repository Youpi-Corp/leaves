import React, { useState } from 'react'
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
  altText?: string
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
  description: 'Display images with optional caption and formatting',
  icon: 'image',
  category: 'Media',
  version: '1.0.0',
  tags: ['image', 'media', 'photo'],
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
          alt={altText || widgetData.label}
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
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      imageUrl: e.target.value,
    })
  }

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      altText: e.target.value,
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          onChange({
            ...widgetData,
            imageUrl: reader.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      className={`space-y-4 border-dashed border-2 ${
        isDragging ? 'border-bfgreen-base' : 'border-gray-300'
      } p-4 rounded-md`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
            placeholder="Description for accessibility"
          />
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
          <p className="text-xs text-gray-500 mb-1">Preview:</p>
          <img
            src={widgetData.imageUrl}
            alt={widgetData.altText || widgetData.label}
            className="max-h-40 max-w-full object-contain"
          />
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
