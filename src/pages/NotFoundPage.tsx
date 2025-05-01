import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import Button from '../components/interaction/button/Button'
import { FaHome } from 'react-icons/fa'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-bfgreen-white to-transparent">
        <div className="text-center max-w-lg px-6">
          <h1 className="text-9xl font-bold text-bfbrown-base">404</h1>
          <h2 className="text-3xl font-semibold text-bfbrown-dark mt-4 mb-6">Page Not Found</h2>
          <p className="text-bfbrown-base mb-8">
            You&apos;ve wandered too far in this forest traveler. Better go back to the safety of the main path.
          </p>
          <div className="flex justify-center">
            <Button 
              accent="primary" 
              className="px-8 py-3"
              icon={<FaHome />}
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default NotFoundPage