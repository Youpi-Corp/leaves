import React from 'react'
import { FaBars } from 'react-icons/fa'

interface MobileHeaderProps {
  onMenuToggle: () => void
  title?: string
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuToggle,
  title = 'User Menu',
}) => {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        aria-label="Open menu"
      >
        <FaBars className="w-5 h-5" />
      </button>
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="w-9"></div> {/* Spacer for centering */}
    </div>
  )
}

export default MobileHeader
