import React from 'react'
import { Module } from '../../../api/module/module.queries'
import { subscribeToModuleQuery, unsubscribeFromModuleQuery } from '../../../api/module/module.queries'

// Constantes des types de boutons prédéfinis
export const BUTTON_TYPES = {
  SUBSCRIBE: {
    label: 'Subscribe',
    loadingLabel: 'Subscribing...',
    className: 'px-3 py-1 bg-bfgreen-base text-white text-sm rounded hover:bg-bfgreen-dark transition-colors disabled:opacity-50',
    action: subscribeToModuleQuery
  },
  UNSUBSCRIBE: {
    label: 'Unsubscribe',
    loadingLabel: 'Removing...',
    className: 'px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors disabled:opacity-50',
    action: unsubscribeFromModuleQuery
  },
  EDIT: {
    label: 'Edit',
    loadingLabel: 'Loading...',
    className: 'px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors disabled:opacity-50',
    action: async (moduleId: number) => {
      console.log('Edit module:', moduleId)
    }
  }
} as const

export type ButtonType = keyof typeof BUTTON_TYPES

interface CardProps {
  module: Module
  onClick: (id: number) => void
  buttonType?: ButtonType
  onActionComplete?: (moduleId: number, success: boolean) => void
}

const ModuleCard: React.FC<CardProps> = ({ 
  module, 
  onClick, 
  buttonType,
  onActionComplete 
}) => {
  const [isLoading, setIsLoading] = React.useState(false)

  const buttonConfig = buttonType ? BUTTON_TYPES[buttonType] : null

  const handleActionClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!buttonConfig) return

    setIsLoading(true)
    try {
      await buttonConfig.action(module.id)
      onActionComplete?.(module.id, true)
    } catch (error) {
      console.error(`Failed to ${buttonType?.toLowerCase()}:`, error)
      onActionComplete?.(module.id, false)
    } finally {
      setIsLoading(false)
    }
  }

  const truncateText = (
    text: string | null,
    maxLength: number = 100
  ) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  if (!module) {
    return (
      <div className="h-full border rounded-lg shadow-sm bg-white p-4 flex items-center justify-center text-red-500">
        Module not found
      </div>
    )
  }

  return (
    <div className="h-full relative transition-all duration-200 hover:-translate-y-1">
      <div
        className="border rounded-lg shadow-sm hover:shadow-md bg-white h-full flex flex-col cursor-pointer"
        onClick={() => onClick(module.id)}
      >
        <div className="p-4 flex-grow">
          <div className="flex mb-3">
            <svg
              className="w-6 h-6 text-bfgreen-base"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-bfbase-black mb-2 truncate" title={module.title || 'Untitled Module'}>
            {truncateText(module.title, 50) || 'Untitled Module'}
          </h2>
          <p 
            className="text-sm text-bfbase-grey mb-2 overflow-hidden" 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.2em',
              maxHeight: '2.4em'
            }}
            title={module.description || ''}
          >
            {truncateText(module.description, 80)}
          </p>
          <div className="mt-4 flex justify-between text-sm text-bfgreen-base">
            <span>
              {module.courses_count || 0}{' '}
              {(module.courses_count || 0) === 1 ? 'course' : 'courses'}
            </span>
          </div>
        </div>
      </div>

      {buttonConfig && (
        <div className="absolute top-2 right-2">
          <button
            onClick={handleActionClick}
            disabled={isLoading}
            className={buttonConfig.className}
            title={`${buttonConfig.label} this module`}
          >
            {isLoading ? buttonConfig.loadingLabel : buttonConfig.label}
          </button>
        </div>
      )}
    </div>
  )
}

export default ModuleCard
