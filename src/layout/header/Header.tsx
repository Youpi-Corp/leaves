import React from 'react'
import LinkNavigation from '../../components/interaction/link/LinkNavigation'
import SearchBar from '../../components/interaction/input/SearchBar'
import Button from '../../components/interaction/button/Button'
import { FaUser } from 'react-icons/fa'

const Header: React.FC = () => {
  return (
    <header className="bg-bfgreen-white p-4 flex items-center">
      <div className="flex items-center justify-start">
        <img className="h-8 w-8" src="./brainforest.svg" />
        <h1 className="text-xl font-bold ml-4 text-bfgreen-base">
          BrainForest
        </h1>
        <ul className="ml-8 flex">
          <li>
            <LinkNavigation>Courses</LinkNavigation>
          </li>
          <li>
            <LinkNavigation>Explore</LinkNavigation>
          </li>
          <li>
            <LinkNavigation>Contribute</LinkNavigation>
          </li>
        </ul>
      </div>
      <div className="flex ml-auto">
        <SearchBar />
        <Button icon={<FaUser />} className="px-6 ml-4 text-sm">
          Sign in
        </Button>
      </div>
    </header>
  )
}

export default Header
