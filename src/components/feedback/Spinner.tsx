import React from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-4',
    lg: 'w-12 h-12 border-8',
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-transparent
        rounded-full
        animate-spin
        ${className}
      `}
    ></div>
  )
}

export default Spinner
