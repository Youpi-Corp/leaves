import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import UserLayout from '../components/layout/UserLayout'
import ModuleCard from '../components/layout/modulecard/ModuleCard'
import Spinner from '../components/feedback/Spinner'
import {
  useSubscribedModules,
  useUnsubscribeFromModule,
} from '../api/module/module.services'
import { useCurrentUser } from '../api/user/user.services'
import { FaBookmark } from 'react-icons/fa'

const SubscriptionsPage: React.FC = () => {
  const navigate = useNavigate()

  // Get current user data
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser()

  // Get subscribed modules
  const {
    data: subscribedModules,
    isLoading: modulesLoading,
    error: modulesError,
  } = useSubscribedModules()

  // Unsubscribe mutation
  const unsubscribeMutation = useUnsubscribeFromModule()

  const handleUnsubscribe = async (moduleId: number) => {
    try {
      await unsubscribeMutation.mutateAsync(moduleId)
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
    }
  } // Loading state
  if (userLoading || modulesLoading) {
    return (
      <>
        <Header />
        <UserLayout userRole={user?.roles?.[0]} isAuthenticated={!!user}>
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        </UserLayout>
        <Footer />
      </>
    )
  }

  // Error state
  if (userError || modulesError) {
    return (
      <>
        <Header />
        <UserLayout userRole={user?.roles?.[0]} isAuthenticated={!!user}>
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500 text-center">
              <p>Error loading subscriptions</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-bfgreen-base text-white rounded hover:bg-bfgreen-dark"
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
          <h1 className="text-3xl sm:text-4xl font-bold text-bfgreen-dark mb-8">
            My Subscriptions
          </h1>

          {!subscribedModules || subscribedModules.length === 0 ? (
            <div className="text-center py-12">
              <FaBookmark className="mx-auto mb-4 text-6xl text-gray-300" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                No Subscriptions Yet
              </h2>
              <p className="text-gray-500 mb-6">
                You haven&apos;t subscribed to any modules yet. Browse our
                courses to find interesting content!
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-bfgreen-base text-white rounded-lg hover:bg-bfgreen-dark transition-colors"
              >
                Browse Modules
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  You have{' '}
                  <span className="font-semibold text-bfgreen-base">
                    {subscribedModules.length}
                  </span>{' '}
                  active subscription
                  {subscribedModules.length !== 1 ? 's' : ''}
                </p>
              </div>{' '}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscribedModules.map((module) => (
                  <div key={module.id} className="relative">
                    <ModuleCard
                      module={module}
                      onClick={() => navigate(`/module/${module.id}`)}
                    />

                    {/* Unsubscribe button overlay */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUnsubscribe(module.id)
                        }}
                        disabled={unsubscribeMutation.isPending}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                        title="Unsubscribe from this module"
                      >
                        {unsubscribeMutation.isPending
                          ? 'Removing...'
                          : 'Unsubscribe'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Additional actions */}
              <div className="mt-12 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-bfgreen-base text-white rounded-lg hover:bg-bfgreen-dark transition-colors mr-4"
                >
                  Browse More Modules
                </button>
                <button
                  onClick={() => navigate('/edition/dashboard/')}
                  className="px-6 py-3 border border-bfgreen-base text-bfgreen-base rounded-lg hover:bg-bfgreen-white transition-colors"
                >
                  Create Your Own Module
                </button>
              </div>
            </>
          )}
        </div>
      </UserLayout>
      <Footer />
    </>
  )
}

export default SubscriptionsPage
