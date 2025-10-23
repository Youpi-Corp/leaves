import React, { useState } from 'react'
import { getVisibleNavigationItems } from '../../utils/navigation.utils'
import UserSidebar from './UserSidebar'
import MobileHeader from './MobileHeader'
import MobileOverlay from './MobileOverlay'
import UserContentArea from './UserContentArea'

interface UserLayoutProps {
  children: React.ReactNode
  userRole?: string | string[]
  isAuthenticated?: boolean
}

const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  userRole,
  isAuthenticated = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const visibleItems = getVisibleNavigationItems(userRole, isAuthenticated)

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen)
  const handleSidebarClose = () => setSidebarOpen(false)

  return (
    <div className="flex flex-1">
      <MobileOverlay isVisible={sidebarOpen} onClose={handleSidebarClose} />

      <UserSidebar
        visibleItems={visibleItems}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      <main className="flex-1 min-h-0">
        <MobileHeader onMenuToggle={handleSidebarToggle} />
        <UserContentArea>{children}</UserContentArea>
      </main>
    </div>
  )
}

export default UserLayout
