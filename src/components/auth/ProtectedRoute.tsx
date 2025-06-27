import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Spinner from '../feedback/Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiresRole?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresRole,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role requirements if specified
  if (requiresRole && user?.roles) {
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles]
    const hasRequiredRole = requiresRole.some((role) =>
      userRoles.some(
        (userRole) => userRole.toLowerCase() === role.toLowerCase()
      )
    )

    if (!hasRequiredRole) {
      // Redirect to home or unauthorized page if user doesn't have required role
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
