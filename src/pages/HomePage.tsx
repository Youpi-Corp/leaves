import React from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import CardCarousel from '../components/layout/CardCarousel'
import FeaturedGrid from '../components/layout/FeaturedGrid'
import HighlightBanner from '../components/layout/HighlightBanner'

const HomePage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex-1 mx-4 md:mx-8 lg:mx-12">
        <HighlightBanner carouselId="trending" className="mb-8" />
        <CardCarousel carouselId="recent" itemsToShow={5} className="mb-8" />
        <FeaturedGrid carouselId="continue" maxItems={6} />
      </div>
    </PageWrapper>
  )
}

export default HomePage
