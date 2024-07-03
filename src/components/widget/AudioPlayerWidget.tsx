import React, { useState, useCallback } from 'react'

const AudioPlayerWidget: React.FC<{
  content: string
  onContentChange: (newContent: string) => void
}> = ({ content, onContentChange }) => {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type.startsWith('audio/')) {
          const url = URL.createObjectURL(file)
          onContentChange(url)
        } else {
          alert('Please drop an audio file.')
        }
      }
    },
    [onContentChange],
  )

  return (
    <div
      className={`flex flex-col p-4 border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        value={content}
        onChange={(e) => {
          e.stopPropagation()
          onContentChange(e.target.value)
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full mb-2"
        placeholder="Audio source or drag & drop audio file here"
      />
      <audio controls src={content} className="w-full" />
      {!content && (
        <p className="text-center text-gray-500 mt-2">
          Drag & drop an audio file here
        </p>
      )}
    </div>
  )
}

export default AudioPlayerWidget
