import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/interaction/button/Button'
import { FaArrowLeft, FaTools } from 'react-icons/fa'

const WIPPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bfgreen-white to-bfgreen-lighter px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-bfgreen-light rounded-full flex items-center justify-center">
              <FaTools className="text-6xl text-bfgreen-base" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-xl">🚧</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-bfgreen-darker mb-4">
          Work in Progress
        </h1>
        
        <p className="text-lg text-bfbase-grey mb-2">
          We're still building this page.
        </p>
        
        <p className="text-base text-bfbase-grey mb-8">
          Our team is hard at work creating something amazing for you. 
          Check back soon to see what we've been working on!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate(-1)}
            accent="secondary"
            icon={<FaArrowLeft />}
            className="px-6 py-3"
          >
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            accent="primary"
            className="px-6 py-3"
          >
            Go to Home
          </Button>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-bfgreen-light">
          <h2 className="text-xl font-semibold text-bfgreen-darker mb-3">
            Coming Soon
          </h2>
          <p className="text-sm text-bfbase-grey">
            Want to contribute to this page? Check out our{' '}
            <a
              href="https://github.com/Youpi-Corp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bfgreen-base hover:text-bfgreen-dark font-semibold underline"
            >
              GitHub repository
            </a>{' '}
            to see how you can help build BrainForest.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WIPPage
