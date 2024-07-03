import React from 'react'
import LinkButton from '../../interaction/button/LinkButton'
import PrimaryButton from '../../interaction/button/PrimaryButton'

const Header: React.FC = () => {
  return (
    <header className="bg-bfgreen-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img className="h-8 w-8" src="./brainforest.svg" />
        <h1 className="text-xl font-semibold ml-4 text-bfgreen-base">
          Brainforest
        </h1>
        <ul className="ml-6 flex space-x-4">
          <li>
            <LinkButton>Courses</LinkButton>
          </li>
          <li>
            <LinkButton>Discover</LinkButton>
          </li>
          <li>
            <LinkButton>Contribute</LinkButton>
          </li>
        </ul>
      </div>
      <PrimaryButton className="ml-auto">Sign in</PrimaryButton>
    </header>
  )
}

export default Header
