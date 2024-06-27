import React from 'react'
import './Header.css'

const Header: React.FC = () => {
  return (
    <header className="header">
      <img
        className="header-logo"
        src="./brainforest.svg"
        alt="Brainforest Logo"
        width={30}
        height={30}
      />
      <h2 className="header-title">Brainforest</h2>
    </header>
  )
}

export default Header
