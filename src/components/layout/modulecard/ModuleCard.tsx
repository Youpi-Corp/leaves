import React from 'react'
import { Module } from '../../../api/module/module.queries'

interface CardProps {
  module: Module
  onClick: (id: number) => void
}

const ModuleCard: React.FC<CardProps> = ({ module, onClick }) => {
  const truncateDescription = (
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
    <div className="h-full">
      <div
        className="border rounded-lg shadow-sm hover:shadow-md bg-white h-full flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1"
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
          <h2 className="text-lg font-semibold text-bfbase-black mb-2 overflow-hidden text-ellipsis line-clamp-2">
            {module.title || 'Untitled Module'}
          </h2>
          <p className="text-sm text-bfbase-grey mb-2 overflow-hidden text-ellipsis line-clamp-2">
            {truncateDescription(module.description, 40)}
          </p>
          <div className="mt-4 flex justify-between text-sm text-bfgreen-base">
            <span>
              {module.courses_count || 0}{' '}
              {(module.courses_count || 0) === 1 ? 'course' : 'courses'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleCard
