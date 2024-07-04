import React from 'react'
import { useDroppable } from '@dnd-kit/core'

const DropArea = ({ children }: { children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({
    id: 'drop-area',
  })

  return (
    <div
      ref={setNodeRef}
      className="relative w-full h-full min-h-[600px] border-2 border-dashed"
    >
      {children}
    </div>
  )
}

export default DropArea
