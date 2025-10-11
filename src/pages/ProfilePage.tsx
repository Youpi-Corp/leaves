import React, { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import { userQuery } from '../api/user/user.queries'
import { useQuery } from '@tanstack/react-query'
import { useLogout } from '../api/user/user.services'
import { FaPenNib, FaShieldAlt } from 'react-icons/fa'
import UserLayout from '../components/layout/UserLayout'
import CardCarousel from '../components/layout/CardCarousel'
import EditProfileModal from '../components/profile/EditProfileModal'

const ProfilePage: React.FC = () => {
  const { logout } = useLogout()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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
      <PageWrapper>
        <UserLayout userRole={undefined} isAuthenticated={false}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-bfgreen-base border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </UserLayout>
      </PageWrapper>
    )
  }
  if (error) {
    return (
      <PageWrapper>
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
      </PageWrapper>
    )
  }
  return (
    <PageWrapper>
      <UserLayout userRole={user?.roles} isAuthenticated={!!user}>
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
          </div>{' '}
          {/* User Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Information
              </h2>
              <button
                className="px-4 py-2 bg-bfgreen-base text-white rounded hover:bg-bfgreen-dark"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Profile
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3 flex flex-col items-center">
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={`${user.pseudo}'s profile`}
                    className="w-48 h-48 rounded-full object-cover border-4 border-bfgreen-base"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center border-4 border-bfgreen-base">
                    <span className="text-6xl text-gray-400">
                      {user?.pseudo?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <p className="mt-4 text-sm text-gray-500">Profile Picture</p>
              </div>

              <div className="md:w-2/3">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Biography
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                    {user?.biography ? (
                      <p className="text-gray-600">{user.biography}</p>
                    ) : (
                      <p className="text-gray-400 italic">
                        No biography provided
                      </p>
                    )}
                  </div>
                </div>

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
          {/* Edit Profile Modal */}
          {user && isEditModalOpen && (
            <EditProfileModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              user={user}
            />
          )}
        </div>
      </UserLayout>
    </PageWrapper>
  )
}

export default ProfilePage
