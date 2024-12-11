import React, { useRef, useState, useEffect } from 'react'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import WidgetData from '../../types/WidgetData'
import TextWidget from './TextWidget'
import ButtonWidget from './ButtonWidget'
import ImageWidget from './ImageWidget'
import AudioPlayerWidget from './AudioPlayerWidget'
import MarkdownWidget from './MarkdownWidget'

const widgetComponents: { [key: string]: React.ComponentType<any> } = {
  text: TextWidget,
  button: ButtonWidget,
  image: ImageWidget,
  audioPlayer: AudioPlayerWidget,
  markdown: MarkdownWidget,
}

interface GenericWidgetProps {
  id: string;
  type: string;
  content: any; // Consider making this more specific if possible
  size: {
    width: number;
    height: number;
  };
  onDelete: (id: string) => void;
  onContentChange: (id: string, content: any) => void;
  onResize: (id: string) => void; // Add this line
}

const GenericWidget: React.FC<GenericWidgetProps> = (props) => {
  const { id, type, content, onContentChange } = props
  const headerRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  const SpecificWidget = widgetComponents[type]

  if (!SpecificWidget) {
    return <div>Unknown widget type: {type}</div>
  }

  const handleWidgetClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsActive(true)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (
        target.classList.contains('react-resizable-handle') ||
        target.classList.contains('delete-button') ||
        target.classList.contains('style-bar') ||
        target.closest('.style-bar') ||
        (headerRef.current && headerRef.current.contains(target))
      ) {
        return;
      }

      if (!nodeRef.current?.contains(target)) {
        setIsActive(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={nodeRef}
      className="h-full bg-white shadow-md rounded-lg overflow-hidden"
      onClick={handleWidgetClick}
    >
      {isActive && (
        <div ref={headerRef} className="drag-handle bg-gray-200 cursor-move text-sm p-1">
          Drag here
        </div>
      )}
      {isActive && (
        <button
          onClick={() => props.onDelete(id)}
          className="delete-button absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          style={{ transform: 'translate(50%, -50%)' }}
        >
          ×
        </button>
      )}
      <div className="p-4 flex flex-col h-full">
        <SpecificWidget
          {...props}
          content={content}
          onContentChange={(newContent: any) =>
            onContentChange(id, newContent)
          }
          isActive={isActive}
          setActive={() => setIsActive(true)}
        />
      </div>
    </div>
  )
}

export default GenericWidget
