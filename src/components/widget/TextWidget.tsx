import React, { useState } from 'react'

interface TextStyle {
  fontSize: number
  fontWeight: string
  fontStyle: string
  textAlign: 'left' | 'center' | 'right'
}

interface TextWidgetProps {
  content: string
  onContentChange: (newContent: string) => void
  isActive?: boolean
  setActive: () => void
}

const TextWidget: React.FC<TextWidgetProps> = ({ 
  content, 
  onContentChange,
  isActive,
  setActive 
}) => {
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left'
  })

  const adjustFontSize = (delta: number) => {
    setTextStyle(prev => ({
      ...prev,
      fontSize: Math.max(8, Math.min(32, prev.fontSize + delta))
    }))
  }

  const toggleStyle = (property: keyof TextStyle, value: string) => {
    setTextStyle(prev => ({
      ...prev,
      [property]: prev[property] === value ? 'normal' : value
    }))
  }

  return (
    <div
      className="flex flex-col w-full h-full"
      onClick={setActive}
      >
      <textarea
        value={content}
        onChange={(e) => {
          e.stopPropagation()
          onContentChange(e.target.value)
        }}
        onClick={(e) => {
          e.stopPropagation()
          setActive()
        }}
        className="w-full h-full resize-none"
        style={{
          fontSize: `${textStyle.fontSize}px`,
          fontWeight: textStyle.fontWeight,
          fontStyle: textStyle.fontStyle,
          textAlign: textStyle.textAlign,
        }}
      />
      {isActive && (
        <div
          className="style-bar flex gap-1 mb-2 bg-gray-100 rounded p-0.5"
          onClick={(e) => {
            e.stopPropagation()
            setActive()
          }}
          >
          <button
            onClick={() => adjustFontSize(-1)}
            className="px-1 py-0.5 bg-white rounded hover:bg-gray-50 text-xs"
          >
            A-
          </button>
          <button
            onClick={() => adjustFontSize(1)}
            className="px-1 py-0.5 bg-white rounded hover:bg-gray-50 text-xs"
          >
            A+
          </button>
          <button
            onClick={() => toggleStyle('fontWeight', 'bold')}
            className={`px-1 py-0.5 bg-white rounded hover:bg-gray-50 text-xs ${
              textStyle.fontWeight === 'bold' ? 'bg-gray-200' : ''
            }`}
          >
            B
          </button>
          <button
            onClick={() => toggleStyle('fontStyle', 'italic')}
            className={`px-1 py-0.5 bg-white rounded hover:bg-gray-50 text-xs ${
              textStyle.fontStyle === 'italic' ? 'bg-gray-200' : ''
            }`}
          >
            I
          </button>
        </div>
      )}
    </div>
  )
}

export default TextWidget
