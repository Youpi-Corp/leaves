import React from 'react'
import { useNavigation } from '../../contexts/NavigationContext'
import { FaChevronRight, FaHome } from 'react-icons/fa'

interface BreadcrumbProps {
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className = '' }) => {
  const { navigationState, navigateWithBreadcrumb } = useNavigation()
  const { breadcrumbs } = navigationState

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && <FaChevronRight className="w-3 h-3 text-gray-400" />}

          {item.isActive ? (
            <span className="text-gray-900 font-medium">
              {index === 0 && <FaHome className="w-4 h-4 inline mr-1" />}
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => navigateWithBreadcrumb(item.path)}
              className="hover:text-gray-900 transition-colors duration-150 flex items-center"
            >
              {index === 0 && <FaHome className="w-4 h-4 inline mr-1" />}
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
