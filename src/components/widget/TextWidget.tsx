import React from 'react'

const TextWidget: React.FC<{
  content: string
  onContentChange: (newContent: string) => void
}> = ({ content, onContentChange }) => {
  return (
    <input
      value={content}
      onChange={(e) => {
        e.stopPropagation()
        onContentChange(e.target.value)
      }}
      onClick={(e) => e.stopPropagation()}
      className="w-full"
    />
  )
}

export default TextWidget
