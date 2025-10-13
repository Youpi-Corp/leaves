import React from 'react'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'

interface PageWrapperProps {
  children: React.ReactNode
}

/**
 * PageWrapper component that provides consistent page structure
 * with header and footer properly positioned
 */
const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default PageWrapper
