import React, { useState, useCallback, useRef } from 'react'

const ImageWidget: React.FC<{
  content: { src: string; alt: string }
  onContentChange: (newContent: { src: string; alt: string }) => void
}> = ({ content, onContentChange }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            onContentChange({ ...content, src: event.target.result })
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleDoubleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  return (
    <div
      className={`flex flex-col ${isDragging ? 'border-2 border-dashed border-blue-500' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {content.src ? (
        <img src={content.src} alt={content.alt} className="w-full" />
      ) : (
        <div
          className="w-full h-32 flex items-center justify-center bg-gray-200 text-gray-500 cursor-pointer"
          onDoubleClick={handleDoubleClick}
        >
          Drag and drop an image here, or double-click to select a file
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ImageWidget
