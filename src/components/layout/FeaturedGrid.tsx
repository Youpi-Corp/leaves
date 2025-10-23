import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CarouselService } from '../../api/services/carousel.service'
import { Module } from '../../api/module/module.queries'

interface FeaturedGridProps {
  carouselId: string
  maxItems?: number
  className?: string
}

const FeaturedGrid: React.FC<FeaturedGridProps> = ({
  carouselId,
  maxItems = 6,
  className = '',
}) => {
  const navigate = useNavigate()
  const [modules, setModules] = useState<Module[]>([])
  const [title, setTitle] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCarouselData = async () => {
      try {
        setLoading(true)
        setError(null)

        const carouselData = await CarouselService.getCarouselData(carouselId)
        setModules(carouselData.modules.slice(0, maxItems))
        setTitle(carouselData.title)
      } catch (error) {
        console.error('Error loading grid data:', error)
        setError('Failed to load modules')
        setModules([])
      } finally {
        setLoading(false)
      }
    }

    loadCarouselData()
  }, [carouselId, maxItems])

  const handleCardClick = (id: number) => {
    navigate(`/module/${id}`)
  }

  const truncateDescription = (
    text: string | null,
    maxLength: number = 100
  ) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className={`w-full py-6 ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-sm bg-white p-4 h-48"
            >
              <div className="flex mb-3">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded mb-2 w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-2/3 animate-pulse"></div>
              <div className="mt-4 flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`w-full py-6 ${className}`}>
        {title && (
          <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
        )}
        <div className="text-red-500 text-center py-8">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (modules.length === 0) {
    return (
      <div className={`w-full py-6 ${className}`}>
        {title && (
          <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
        )}
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-bfbase-lightergrey rounded-lg border-2 border-dashed border-gray-300">
          <svg
            className="w-20 h-20 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No modules to display</h3>
          <p className="text-sm text-gray-500 text-center max-w-md">
            There are currently no modules available in this section.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full py-6 ${className}`}>
      {title && (
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            className="border rounded-lg shadow-sm hover:shadow-md bg-white flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1"
            onClick={() => handleCardClick(module.id)}
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
                {truncateDescription(module.description, 80)}
              </p>
              <div className="mt-4 flex justify-between text-sm text-bfgreen-base">
                <span>
                  {module.courses_count || 0}{' '}
                  {(module.courses_count || 0) === 1 ? 'course' : 'courses'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedGrid
