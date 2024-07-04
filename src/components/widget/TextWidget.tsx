import React from 'react'

const TextWidget: React.FC<{
  content: string
  onContentChange: (newContent: string) => void
}> = ({ content, onContentChange }) => {
  return (
    <textarea
      value={content}
      onChange={(e) => {
        e.stopPropagation()
        onContentChange(e.target.value)
      }}
      onClick={(e) => e.stopPropagation()}
      className="w-full h-full resize-none"
    />
  )
}

export default TextWidget
