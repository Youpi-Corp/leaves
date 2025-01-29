import React from 'react'
import LinkHeader from '../../components/interaction/link/LinkHeader'
import SearchBar from '../../components/interaction/input/SearchBar'
import ButtonUser from '../../components/interaction/button/ButtonUser'

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
            <LinkHeader>Courses</LinkHeader>
          </li>
          <li>
            <LinkHeader>Explore</LinkHeader>
          </li>
          <li>
            <LinkHeader>Contribute</LinkHeader>
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
