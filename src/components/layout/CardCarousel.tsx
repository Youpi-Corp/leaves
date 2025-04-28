import React, { useState, useRef, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ModuleCard from './modulecard/ModuleCard'


const fetchCarouselData = (carouselId: string) => {
  // A remplacer par des call api quand on en aura
  const data = {
    'featured': {
      title: 'Featured Modules',
        modules: [
          { id: -1},
          { id: -1},
          { id: -1},
          { id: -1},
          { id: -1},
          { id: -1}
        ]
      },
    'popular': {
      title: 'Popular This Week',
      modules: [
        { id: -1},
        { id: -1},
        { id: -1},
        { id: -1}
      ]
      },
    'recent': {
      title: 'Recently Added',
      modules: [
        { id: -1},
        { id: -1},
        { id: -1}
      ]
      },
    "continue": {
      title: 'Continue Learning',
      modules: [
        { id: -1},
        { id: -1},
        { id: -1},
        { id: -1}
      ]
    },
    };
    
    return data[carouselId as keyof typeof data] || { title: 'Unknown Carousel', modules: [] };
  }

interface CardCarouselProps {
  carouselId: string
  title?: string
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
  const [cards, setCards] = useState<{ id: number }[]>([])

useEffect(() => {
  const carouselData = fetchCarouselData(carouselId);  
  if (carouselData && carouselData.modules) {
    setCards(carouselData.modules);
  }
}, [carouselId]);

const [title, setTitle] = useState<string | undefined>();
useEffect(() => {
  const carouselData = fetchCarouselData(carouselId);
  if (carouselData && carouselData.title) {
    setTitle(carouselData.title);
  }
}, [carouselId]);


  useEffect(() => {
    const updateVisibleItems = () => {
      if (!containerRef.current) return
      
      const containerWidth = containerRef.current.offsetWidth
      
      if (containerWidth < 640) {
        setVisibleItems(1)
      } else if (containerWidth < 1024) {
        setVisibleItems(Math.min(2, itemsToShow))
      } else {
        setVisibleItems(Math.min(itemsToShow, cards.length))
      }
    }

    updateVisibleItems()
    window.addEventListener('resize', updateVisibleItems)
    
    return () => {
      window.removeEventListener('resize', updateVisibleItems)
    }
  }, [itemsToShow, cards.length])

  const totalSlides = Math.max(0, cards.length - visibleItems + 1)
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      Math.min(cards.length - visibleItems, prevIndex + 1)
    )
  }
  const showNavigation = cards.length > visibleItems

  return (
    <div 
      ref={containerRef}
    >
      {title && (
        <h1>{title}</h1>
      )}
      
      <div className="relative">
        {showNavigation && (
          <>
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous slides"
            >
              <FaChevronLeft className="text-xl" />
            </button>
            
            <button 
              onClick={handleNext}
              disabled={currentIndex >= totalSlides - 1}
              aria-label="Next slides"
            >
              <FaChevronRight className="text-xl" />
            </button>
          </>
        )}        
        <div>
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            }}
          >
            {cards.map((card, index) => (
                <div 
                    key={index}
                >
                    <ModuleCard id={card.id} />
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardCarousel