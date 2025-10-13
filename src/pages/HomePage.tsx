import React from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import CardCarousel from '../components/layout/CardCarousel'

const HomePage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex-1 mx-4 md:mx-8 lg:mx-12">
        <CardCarousel carouselId="featured" itemsToShow={5} />
        <CardCarousel carouselId="recent" itemsToShow={5} />
        <CardCarousel carouselId="continue" itemsToShow={5} />
      </div>
    </PageWrapper>
  )
}

export default HomePage
