import React from 'react'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import CardCarousel from '../components/layout/CardCarousel'

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen mx-4 md:mx-8 lg:mx-12">
        <CardCarousel carouselId="featured" itemsToShow={5} />
        <CardCarousel carouselId="recent" itemsToShow={5} />
        <CardCarousel carouselId="continue" itemsToShow={5} />
      </div>
      <Footer />
    </>
  )
}

export default HomePage
