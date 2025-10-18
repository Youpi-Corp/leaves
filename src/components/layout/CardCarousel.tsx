import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ModuleCard from './modulecard/ModuleCard'
import { CarouselService } from '../../api/services/carousel.service'
import { Module } from '../../api/module/module.queries'

interface CarouselData {
  title: string
  modules: Module[]
}

const fetchCarouselData = async (carouselId: string): Promise<CarouselData> => {
  return await CarouselService.getCarouselData(carouselId)
}

interface CardCarouselProps {
  carouselId: string
  itemsToShow?: number
  className?: string
}

const CardCarousel: React.FC<CardCarouselProps> = ({
  carouselId,
  itemsToShow = 3,
  className = '',
}) => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(itemsToShow)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [title, setTitle] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const cardWidth = 320 // Fixed card width in pixels, changed from state to constant
  useEffect(() => {
    const loadCarouselData = async () => {
      try {
        setLoading(true)
        setError(null)

        const carouselData = await fetchCarouselData(carouselId)

        setModules(carouselData.modules)
        setTitle(carouselData.title)
      } catch (error) {
        console.error('Error loading carousel data:', error)
        setError('Failed to load modules')
        setModules([])
      } finally {
        setLoading(false)
      }
    }

    loadCarouselData()
  }, [carouselId])

  useEffect(() => {
    const updateVisibleItems = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth

      // Determine how many cards can fit based on container width and fixed card width
      // Account for card margins/padding (16px on each side)
      const cardsPerView = Math.floor(containerWidth / (cardWidth + 16))

      // Ensure at least 1 card is shown
      setVisibleItems(Math.max(1, Math.min(cardsPerView, itemsToShow)))
    }

    updateVisibleItems()
    window.addEventListener('resize', updateVisibleItems)

    return () => {
      window.removeEventListener('resize', updateVisibleItems)
    }
  }, [itemsToShow, cardWidth])

  const totalSlides = Math.max(0, modules.length - visibleItems + 1)
  
  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -(cardWidth + 16),
        behavior: 'smooth'
      })
    }
  }

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: cardWidth + 16,
        behavior: 'smooth'
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Multiply by 2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const showNavigation = modules.length > visibleItems
  const handleCardClick = (id: number) => {
    if (!isDragging) {
      navigate(`/module/${id}`)
    }
  }

  if (loading) {
    return (
      <div className={`w-full py-6 ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(visibleItems)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-2"
              style={{ width: `${cardWidth}px` }}
            >
              <div className="h-64 border rounded-lg shadow-sm bg-white p-4">
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
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-bfbase-lightergrey rounded-lg border-2 border-dashed border-gray-300">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No modules available</h3>
          <p className="text-sm text-gray-500 text-center max-w-md">
            {title === 'Continue Learning' 
              ? 'Start learning by subscribing to modules to see them here.'
              : 'Check back later for new content.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`w-full py-6 ${className}`}>
      {title && (
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
      )}

      <div className="relative">
        {showNavigation && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous slides"
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FaChevronLeft className="text-gray-600 text-xl" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= totalSlides - 1}
              aria-label="Next slides"
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FaChevronRight className="text-gray-600 text-xl" />
            </button>
          </>
        )}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden mx-4 scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex gap-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex-shrink-0"
                style={{ width: `${cardWidth}px` }}
              >
                <ModuleCard module={module} onClick={handleCardClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardCarousel
