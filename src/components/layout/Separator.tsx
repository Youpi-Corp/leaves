import React from 'react'

interface SeparatorProps {
  children?: React.ReactNode
}

const Separator: React.FC<SeparatorProps> = ({ children }) => {
  return (
    <div className="flex flex-row items-center w-full space-x-4">
      <div className="h-[2px] bg-bfbase-grey w-full rounded-full" />
      <div className="text-bfbase-grey">{children}</div>
      <div className="h-[2px] bg-bfbase-grey w-full rounded-full" />
    </div>
  )
}

export default Separator
