import React from 'react'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import { userQuery } from '../api/user/user.queries'
import { useQuery } from '@tanstack/react-query'
import { useLogout } from '../api/user/user.services'
import { FaPenNib, FaShieldAlt } from 'react-icons/fa'
import UserLayout from '../components/layout/UserLayout'
import CardCarousel from '../components/layout/CardCarousel'

const ProfilePage: React.FC = () => {
  const { logout } = useLogout()

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => userQuery(),
  })

  if (isLoading) {
    return (
      <>
        <Header />
        <UserLayout userRole={undefined} isAuthenticated={false}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-bfgreen-base border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </UserLayout>
        <Footer />
      </>
    )
  }
  if (error) {
    return (
      <>
        <Header />
        <UserLayout userRole={undefined} isAuthenticated={false}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">
                Error loading user data
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-bfgreen-base text-white rounded hover:bg-bfgreen-dark"
              >
                Try Again
              </button>
            </div>
          </div>
        </UserLayout>
        <Footer />
      </>
    )
  }
  return (
    <>
      <Header />
      <UserLayout userRole={user?.roles?.[0]} isAuthenticated={!!user}>
        <div className="max-w-6xl mx-auto">
          {/* Welcome section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Welcome, <span className="text-bfgreen-base">{user?.pseudo}</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              From here you can manage your information and preferences for your
              BrainForest account
            </p>
          </div>

          {/* User Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Your Information
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 px-4 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-700">User ID:</span>
                <span className="text-gray-600">{user?.id}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 px-4 rounded-lg">
                <span className="font-medium text-gray-700">Username:</span>
                <span className="text-gray-600">{user?.pseudo}</span>
              </div>{' '}
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 px-4 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-700">Roles:</span>
                <span className="text-gray-600 capitalize">
                  {user?.roles?.join(', ') || 'No roles'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 px-4 rounded-lg">
                <span className="font-medium text-gray-700">
                  Email address:
                </span>
                <span className="text-gray-600">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Settings Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Customization
                </h2>
                <FaPenNib className="text-3xl text-bfgreen-base" />
              </div>
              <p className="text-gray-600">
                Make the BrainForest interface a place you love, a place that
                suits you for your learning
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Privacy & Security
                </h2>
                <FaShieldAlt className="text-3xl text-bfgreen-base" />
              </div>
              <p className="text-gray-600">
                Choose your privacy and security settings for your personal
                information
              </p>
            </div>
          </div>

          {/* Modules Management */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Manage your modules and lessons
            </h2>
            <div className="space-y-6">
              <CardCarousel carouselId="personal" className="mb-6" />
              <CardCarousel carouselId="unfinished" className="mb-6" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>{' '}
          </div>
        </div>
      </UserLayout>
      <Footer />
    </>
  )
}

export default ProfilePage
