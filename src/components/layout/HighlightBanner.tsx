import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CarouselService } from '../../api/services/carousel.service'
import { Module } from '../../api/module/module.queries'

interface HighlightBannerProps {
  carouselId: string
  className?: string
}

const HighlightBanner: React.FC<HighlightBannerProps> = ({
  carouselId,
  className = '',
}) => {
  const navigate = useNavigate()
  const [modules, setModules] = useState<Module[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [title, setTitle] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resetTimer, setResetTimer] = useState(0) // Used to reset the auto-cycle timer

  useEffect(() => {
    const loadCarouselData = async () => {
      try {
        setLoading(true)
        setError(null)

        const carouselData = await CarouselService.getCarouselData(carouselId)
        // Store all modules instead of just the first one
        if (carouselData.modules.length > 0) {
          setModules(carouselData.modules)
        }
        setTitle(carouselData.title)
      } catch (error) {
        console.error('Error loading banner data:', error)
        setError('Failed to load featured module')
        setModules([])
      } finally {
        setLoading(false)
      }
    }

    loadCarouselData()
  }, [carouselId])

  // Auto-cycle through modules every 5 seconds
  useEffect(() => {
    if (modules.length <= 1) return // Don't cycle if there's only one or no modules

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % modules.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [modules.length, resetTimer]) // Depend on resetTimer to restart the interval

  const handleBannerClick = () => {
    if (modules[currentIndex]) {
      navigate(`/module/${modules[currentIndex].id}`)
    }
  }

  const handleStartLearningClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent any parent click handlers
    if (modules[currentIndex]) {
      navigate(`/module/${modules[currentIndex].id}`)
    }
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setResetTimer(prev => prev + 1) // Increment to trigger useEffect and reset timer
  }

  const currentModule = modules[currentIndex]

  if (loading) {
    return (
      <div className={`w-full py-6 ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse">
          {/* Title placeholder - will show actual title once loaded */}
        </div>
        <div className="bg-gradient-to-r from-bfgreen-lighter to-bfgreen-light rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[280px]">
            <div className="md:w-2/3 p-8 flex flex-col justify-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-bfgreen-base/20 text-bfgreen-dark text-sm font-medium w-fit mb-4">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {carouselId === 'trending' ? 'Trending' : 'Featured'}
              </div>
              <div className="h-8 bg-white/50 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="h-4 bg-white/50 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-white/50 rounded w-5/6 mb-6 animate-pulse"></div>
              <div className="flex gap-4 mt-4">
                <div className="h-10 bg-white/50 rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-white/50 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="md:w-1/3 bg-bfgreen-base/20 flex items-center justify-center p-8">
              <div className="w-32 h-32 bg-white/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !currentModule) {
    return (
      <div className={`w-full py-6 ${className}`}>
        {title && (
          <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
        )}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-sm overflow-hidden border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center justify-center py-12 px-8">
            <svg
              className="w-24 h-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No trending content available
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              {error || 'Check back soon for trending modules and courses.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full py-6 ${className}`}>
      {title && (
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
      )}
      
      <div 
        className="bg-gradient-to-r from-bfgreen-lighter to-bfgreen-light rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
      >
        <div className="flex flex-col md:flex-row min-h-[280px]">
          <div className="md:w-2/3 p-8 flex flex-col justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-bfgreen-base/20 text-bfgreen-dark text-sm font-medium w-fit mb-4">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {title === 'Trending This Week' ? 'Trending' : 'Featured'}
            </div>
            <h2 
              key={`title-${currentIndex}`}
              className="text-3xl font-bold text-bfbase-black mb-3 animate-fadeIn"
            >
              {currentModule.title || 'Untitled Module'}
            </h2>
            <p 
              key={`desc-${currentIndex}`}
              className="text-lg text-bfbase-darkgrey mb-6 line-clamp-3 animate-fadeIn"
            >
              {currentModule.description || 'No description available'}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={handleStartLearningClick}
                className="px-6 py-2 bg-bfgreen-base text-white rounded-lg font-semibold hover:bg-bfgreen-dark transition-colors duration-200 shadow-sm"
              >
                Start Learning
              </button>
              <div className="flex items-center text-sm text-bfbase-darkgrey">
                <svg
                  className="w-5 h-5 mr-2 text-bfgreen-base"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="font-medium">
                  {currentModule.courses_count || 0}{' '}
                  {(currentModule.courses_count || 0) === 1 ? 'course' : 'courses'}
                </span>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 bg-bfgreen-base/10 flex items-center justify-center p-8">
            <div className="relative">
              <div className="w-32 h-32 bg-bfgreen-base rounded-full flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-bfgreen-dark rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dot indicators - now in a separate row */}
        {modules.length > 1 && (
          <div className="bg-bfgreen-base/5 flex justify-center gap-2 py-3">
            {modules.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDotClick(index)
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-bfgreen-base w-8'
                    : 'bg-bfgreen-base/30 hover:bg-bfgreen-base/50'
                }`}
                aria-label={`Go to module ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HighlightBanner
