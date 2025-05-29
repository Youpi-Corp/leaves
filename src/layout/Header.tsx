import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/interaction/button/Button'
import LinkHeader from '../components/interaction/link/LinkHeader'
import SearchBar from '../components/interaction/input/SearchBar'
import ButtonUser from '../components/interaction/button/ButtonUser'

const Header: React.FC = () => {
  const navigate = useNavigate()

  return (
    <header className="bg-bfgreen-white/70 backdrop-blur-lg p-4 flex items-center sticky top-0 z-50">
      <div className="flex items-center justify-start">
        <Button
          onClick={() => navigate('/')}
          accent="none"
          className="text-xl text-bfgreen-base font-bold hover:text-bfgreen-dark"
          icon={<img src="/brainforest.svg" className="w-8 h-8" />}
        >
          BrainForest
        </Button>{' '}
        <ul className="ml-8 flex">
          <li>
            <LinkHeader to="/">Courses</LinkHeader>
          </li>
          <li>
            <LinkHeader to="/subscriptions">Subscriptions</LinkHeader>
          </li>
          <li>
            <LinkHeader to="/edition/dashboard/">Create</LinkHeader>
          </li>
          <li>
            <LinkHeader to="/">Contribute</LinkHeader>
          </li>
        </ul>
      </div>
      <div className="flex ml-auto">
        <SearchBar />
        <ButtonUser className="px-6 ml-4" />
      </div>
    </header>
  )
}

export default Header
