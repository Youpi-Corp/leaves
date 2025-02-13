import React from 'react'

interface SeparatorProps {
  className?: string
  children?: React.ReactNode
}

const Separator: React.FC<SeparatorProps> = ({ className, children }) => {
  if (!children) {
    return (
      <div className={`h-[2px] bg-bfbase-grey rounded-full ${className}`} />
    )
  }

  return (
    <div className={`flex flex-row items-center space-x-4 w-full ${className}`}>
      <div className="h-[2px] bg-bfbase-grey w-full rounded-full" />
      <div className="text-bfbase-grey">{children}</div>
      <div className="h-[2px] bg-bfbase-grey w-full rounded-full" />
    </div>
  )
}

export default Separator
