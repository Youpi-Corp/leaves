import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Spinner from '../feedback/Spinner'

interface AuthRedirectProps {
  children: React.ReactNode
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // If user is already authenticated, redirect to home or the page they were trying to access
  if (isAuthenticated) {
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  // User is not authenticated, show the auth page (login/register)
  return <>{children}</>
}

export default AuthRedirect
