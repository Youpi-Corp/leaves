import React from 'react'
import { useNavigation } from '../../contexts/NavigationContext'
import { FaArrowLeft } from 'react-icons/fa'

interface BackButtonProps {
  className?: string
  fallbackPath?: string
  label?: string
  variant?: 'button' | 'link'
}

const BackButton: React.FC<BackButtonProps> = ({
  className = '',
  fallbackPath = '/',
  label = '',
  variant = 'button',
}) => {
  const { goBack, navigationState } = useNavigation()
  const handleClick = () => {
    goBack(fallbackPath)
  }

  // Only show the back button if we can actually go back OR if there's a fallback
  if (!navigationState.canGoBack && !fallbackPath) {
    return null
  }

  // If we can't go back but have a fallback that's not home, show the button
  if (!navigationState.canGoBack && fallbackPath === '/') {
    return null
  }

  const baseClasses =
    variant === 'button'
      ? 'inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150'
      : 'inline-flex items-center text-sm transition-colors duration-150'

  const buttonClasses =
    variant === 'button'
      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
      : 'text-gray-600 hover:text-gray-900'
  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${buttonClasses} ${className}`}
      type="button"
    >
      <FaArrowLeft className="w-4 h-4" />
      {label && <span className="ml-2">{label}</span>}
    </button>
  )
}

export default BackButton
