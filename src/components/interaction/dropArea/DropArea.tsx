import React from 'react'
import { useDroppable } from '@dnd-kit/core'

const DropArea = ({ children }: { children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({
    id: 'drop-area',
  })

  return (
    <div
      ref={setNodeRef}
      className="flex-grow bg-gray-200 p-4 relative"
      style={{ height: '100%', minHeight: '600px' }}
    >
      <h2 className="text-xl font-bold mb-4">Drop Area</h2>
      {children}
    </div>
  )
}

export default DropArea
