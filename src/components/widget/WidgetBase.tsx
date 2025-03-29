// src/widgets/WidgetBase.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';

interface WidgetBaseProps {
  info: {
    label: string;
    text?: string;
    color?: string;
    id: string;
  };
  content: React.ReactNode;
  onDelete?: (id: string) => void;
}

const WidgetBase: React.FC<WidgetBaseProps> = ({ info: WidgetInfo, content: WidgetContent, onDelete }) => {
  const [isActive, setIsActive] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const headerRef = { current: null } as { current: HTMLDivElement | null };

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: WidgetInfo.id
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (
        target.classList.contains('delete-button') ||
        (headerRef.current && headerRef.current.contains(target))
      ) {
        return;
      }

      if (!nodeRef.current?.contains(target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWidgetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(true);
  };

  return (
    <div
      ref={nodeRef}
      className="h-full bg-white shadow-md rounded-lg overflow-hidden relative"
      onClick={handleWidgetClick}
    >
      {isActive && (
        <div 
          ref={(node) => {
            setNodeRef(node);
            if (node) {
              headerRef.current = node;
            }
          }}
          {...attributes}
          {...listeners}
          className="drag-handle bg-gray-200 cursor-move text-sm p-1"
        >
          Drag here
        </div>
      )}
      {/* {isActive && onDelete && (
        <button
          onClick={() => onDelete(WidgetInfo.id)}
          className="delete-button absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          style={{ transform: 'translate(50%, -50%)' }}
        >
          ×
        </button>
      )} */}
      <div className="p-4">
        <h4>{WidgetInfo.label}</h4>
        <div style={{ color: WidgetInfo.color || '#000' }}>
          {WidgetContent}
        </div>
      </div>
    </div>
  );
};

export default WidgetBase;
