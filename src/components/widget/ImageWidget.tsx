import React from 'react'

// Image widget with an input field for the image source and alt text

const ImageWidget: React.FC<{
  content: { src: string; alt: string }
  onContentChange: (newContent: { src: string; alt: string }) => void
}> = ({ content, onContentChange }) => {
  return (
    <div className="flex flex-col">
      <input
        value={content.src}
        onChange={(e) => {
          e.stopPropagation()
          onContentChange({ ...content, src: e.target.value })
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full"
        placeholder="Image source"
      />
      <input
        value={content.alt}
        onChange={(e) => {
          e.stopPropagation()
          onContentChange({ ...content, alt: e.target.value })
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full"
        placeholder="Alt text"
      />
      <img src={content.src} alt={content.alt} className="w-full" />
    </div>
  )
}

export default ImageWidget
