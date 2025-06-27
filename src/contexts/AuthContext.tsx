import React, { createContext, useContext, ReactNode } from 'react'
import { useCurrentUser, useLogout } from '../api/user/user.services'
import { User } from '../api/types/user.types'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: Error | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: user, isLoading, error, isError } = useCurrentUser()
  const { logout } = useLogout()
  const navigate = useNavigate()

  // Consider user authenticated only if we have user data and no error
  const isAuthenticated = !!user && !isError

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated,
    error: error as Error | null,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
