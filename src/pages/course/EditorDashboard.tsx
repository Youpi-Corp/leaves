import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../components/feedback/Spinner'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import ModuleCard from '../../components/layout/modulecard/ModuleCard'
import CreateModuleModal from '../../components/layout/modulecard/CreateModuleModal'
import { getModulesByOwnerQuery, Module } from '../../api/module/module.queries'
import { useCurrentUser } from '../../api/user/user.services'

const EditorDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Get current user data
  const {
    data: currentUser,
    isLoading: userLoading,
    isError: userError,
  } = useCurrentUser()

  useEffect(() => {
    const getModules = async () => {
      // Wait for user data to load
      if (userLoading) return

      // If user data failed to load or user is not authenticated, handle gracefully
      if (userError || !currentUser) {
        setModules([])
        setError('Please log in to view your modules.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Fetch modules owned by the current user
        const data = await getModulesByOwnerQuery(currentUser.id)

        setModules(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch user modules:', err)
        setError('Failed to load your modules. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    getModules()
  }, [currentUser, userLoading, userError])

  const handleModuleClick = (moduleId: number) => {
    navigate(`/edition/dashboard/${moduleId}`)
  }

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleModuleCreated = (newModule: Module) => {
    // Add the new module to the list and close the modal
    setModules([newModule, ...modules])
    closeCreateModal()

    // Navigate to the new module's dashboard
    navigate(`/edition/dashboard/${newModule.id}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto max-w-7xl py-8 px-4 flex-grow">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-bfbase-black">My Modules</h1>
          <button
            className="bg-bfgreen-base hover:bg-bfgreen-dark text-white font-medium py-2 px-4 rounded transition-colors"
            onClick={openCreateModal}
          >
            Create New Module
          </button>
        </div>

        <div className="border-b border-bfbase-lightgrey mb-6"></div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="border-l-bfgreen-base" />
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-bfred-light rounded-lg text-bfred-dark">
            <h2 className="text-xl">{error}</h2>
            <button
              className="mt-4 bg-bfred-dark hover:bg-bfred-base text-white font-medium py-2 px-4 rounded transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-16 bg-bfbase-lightgrey rounded-lg">
            <h2 className="text-xl text-bfbase-darkgrey">
              You haven&apos;t created any modules yet.
            </h2>
            <p className="text-bfbase-darkgrey mt-2 mb-4">
              Start creating engaging content for your students!
            </p>
            <button
              className="mt-4 bg-bfgreen-base hover:bg-bfgreen-dark text-white font-medium py-2 px-4 rounded transition-colors"
              onClick={openCreateModal}
            >
              Create Your First Module
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={handleModuleClick}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />

      {/* Create Module Modal */}
      <CreateModuleModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={handleModuleCreated}
      />
    </div>
  )
}

export default EditorDashboard
