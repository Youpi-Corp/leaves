import React from 'react'

interface UserContentAreaProps {
  children: React.ReactNode
  className?: string
}

const UserContentArea: React.FC<UserContentAreaProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`p-4 sm:p-6 lg:p-8 bg-transparent h-full overflow-y-auto ${className}`}
    >
      {children}
    </div>
  )
}

export default UserContentArea
