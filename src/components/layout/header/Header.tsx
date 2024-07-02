import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img className="h-8 w-8" src="./brainforest.svg" />
        <h2 className="text-xl font-semibold ml-4 text-green-500">
          Brainforest
        </h2>
      </div>
    </header>
  )
}

export default Header
