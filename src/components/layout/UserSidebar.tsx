import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { NavigationItem } from '../../types/navigation.types'

interface UserSidebarProps {
  visibleItems: NavigationItem[]
  isOpen: boolean
  onClose: () => void
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  visibleItems,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (item: NavigationItem) => {
    navigate(item.path)
    onClose() // Close mobile sidebar after navigation
  }

  return (
    <aside
      className={`fixed lg:static left-0 top-0 z-10 w-64 h-screen lg:h-full bg-white shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:justify-start">
          <h2 className="text-lg font-semibold text-gray-800">User Menu</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-bfgreen-white text-bfgreen-base border-l-4 border-bfgreen-base'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span
                  className={`mr-3 ${isActive ? 'text-bfgreen-base' : ''}`}
                >
                  {item.icon}
                </span>
                {item.text}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default UserSidebar
