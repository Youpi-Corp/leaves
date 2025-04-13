import React from 'react'
import {
  ImageWidgetProps,
  WidgetViewProps,
  WidgetEditProps,
  WidgetComponentInterface,
  WidgetMetadata,
} from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'

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

/**
 * Image Widget View Component
 * Displays an image with optional caption
 */
const ImageWidgetView: React.FC<WidgetViewProps<ImageWidgetProps>> = ({
  widgetData,
}) => {
  const { imageUrl, altText, caption, aspectRatio = 'original' } = widgetData

  // Determine aspect ratio class
  let aspectRatioClass = ''
  switch (aspectRatio) {
    case '1:1':
      aspectRatioClass = 'aspect-square'
      break
    case '4:3':
      aspectRatioClass = 'aspect-4/3'
      break
    case '16:9':
      aspectRatioClass = 'aspect-video'
      break
    default:
      // Use original aspect ratio
      aspectRatioClass = ''
  }

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
      aspectRatio: e.target.value as 'original' | '1:1' | '4:3' | '16:9',
    })
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      label: e.target.value,
    })
  }

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
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="original">Original</option>
            <option value="1:1">Square (1:1)</option>
            <option value="4:3">Standard (4:3)</option>
            <option value="16:9">Widescreen (16:9)</option>
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
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
