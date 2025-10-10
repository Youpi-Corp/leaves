import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import UserLayout from '../components/layout/UserLayout'
import ModuleCard from '../components/layout/modulecard/ModuleCard'
import Spinner from '../components/feedback/Spinner'
import { useSubscribedModules } from '../api/module/module.services'
import { useCurrentUser } from '../api/user/user.services'
import { unsubscribeFromModuleQuery } from '../api/module/module.queries'
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
    refetch: refetchSubscriptions,
  } = useSubscribedModules()

  // Loading state
  if (userLoading || modulesLoading) {
    return (
      <>
        <Header />
        <UserLayout userRole={user?.roles} isAuthenticated={!!user}>
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
        <UserLayout userRole={user?.roles} isAuthenticated={!!user}>
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
      <UserLayout userRole={user?.roles} isAuthenticated={!!user}>
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
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onClick={(id) => navigate(`/module/${id}`)}
                    buttonType="UNSUBSCRIBE"
                    onActionComplete={(moduleId, success) => {
                      if (success) {
                        refetchSubscriptions()
                      }
                    }}
                  />
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
