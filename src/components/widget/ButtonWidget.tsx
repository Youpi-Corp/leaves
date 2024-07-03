import React from 'react'

const ButtonWidget: React.FC<{
  content: { label: string; clicks: number }
  onContentChange: (newContent: any) => void
}> = ({ content, onContentChange }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onContentChange({ ...content, clicks: content.clicks + 1 })
      }}
      className="w-full"
    >
      {content.label} (Clicks: {content.clicks})
    </button>
  )
}

export default ButtonWidget
