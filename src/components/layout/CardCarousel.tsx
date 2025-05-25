import React, { useState, useRef, useEffect } from 'react'
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(itemsToShow)
  const containerRef = useRef<HTMLDivElement>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [title, setTitle] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(modules.length - visibleItems, prevIndex + 1)
    )
  }

  const showNavigation = modules.length > visibleItems

  const handleCardClick = (id: number) => {
    console.log(`Card ${id} clicked`)
  }

  if (loading) {
    return (
      <div className={`w-full py-6 ${className}`}>
        {title && (
          <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
        )}
        <div className="flex space-x-4">
          {[...Array(visibleItems)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-2"
              style={{ width: `${cardWidth}px` }}
            >
              <div className="h-64 border rounded-lg shadow-sm bg-white p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <div className="overflow-hidden mx-4">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`,
            }}
          >
            {' '}
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex-shrink-0 px-2"
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
