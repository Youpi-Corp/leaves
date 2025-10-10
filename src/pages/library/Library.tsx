import React, { useState, useEffect } from 'react'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import SearchBar from '../../components/library/SearchBar'
import SortDropdown from '../../components/library/SortDropdown'
import ModuleList from '../../components/library/ModuleList'
import CreateModuleModal from '../../components/layout/modulecard/CreateModuleModal'
import { Module } from '../../api/module/module.queries'
import { getAllModulesQuery } from '../../api/module/module.queries'
import { useNavigate } from 'react-router-dom'
import ModuleCard from '../../components/layout/modulecard/ModuleCard'

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modules, setModules] = useState<Module[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchedModules = await getAllModulesQuery()

        let filteredModules = fetchedModules
        if (searchTerm) {
          filteredModules = filteredModules.filter((module) =>
            module.title?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        if (sortOption === 'mostCourses') {
          filteredModules = filteredModules.sort(
            (a, b) => (b.courses_count || 0) - (a.courses_count || 0)
          )
        } else if (sortOption === 'recent') {
          filteredModules = filteredModules.sort(
            (a, b) =>
              new Date(b.dtc || 0).getTime() - new Date(a.dtc || 0).getTime()
          )
        } else if (sortOption === 'popularity') {
          // Sort by title alphabetically as a fallback since popularity field doesn't exist
          filteredModules = filteredModules.sort((a, b) =>
            (a.title || '').localeCompare(b.title || '')
          )
        }

        setModules(filteredModules)
      } catch (error) {
        console.error('Failed to fetch modules:', error)
      }
    }

    fetchModules()
  }, [searchTerm, sortOption])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleSortChange = (option: string) => {
    setSortOption(option)
  }
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-4 md:mx-8 lg:mx-12">
        {' '}
        {/* Title Section */}
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-2 text-bfbase-black">Library</h1>
          <p className="text-bfbase-grey mb-8">
            Discover and explore knowledge modules in the Brainforest Library
          </p>
        </div>
        {/* Controls Section */}
        <div className="mb-8">
          <div className="border rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="w-full lg:w-64">
                <SortDropdown
                  onSortChange={handleSortChange}
                  sortOption={sortOption}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Results Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-bfbase-black">
              {searchTerm
                ? `Search Results (${modules.length})`
                : `All Modules (${modules.length})`}
            </h2>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-bfgreen-base hover:text-bfgreen-dark underline"
              >
                Clear search
              </button>
            )}
          </div>

          {modules.length === 0 ? (
            <div className="text-center py-16 bg-bfbase-lightgrey rounded-lg">
              <div className="text-bfbase-grey text-6xl mb-4">📚</div>
              <h3 className="text-xl font-medium text-bfbase-darkgrey mb-2">
                {searchTerm ? 'No modules found' : 'No modules available'}
              </h3>
              <p className="text-bfbase-grey mb-6">
                {searchTerm
                  ? 'Try adjusting your search terms.'
                  : 'No modules are currently available.'}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onClick={(id) => navigate(`/module/${id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Modal */}
        {isModalOpen && (
          <CreateModuleModal
            isOpen={isModalOpen}
            onClose={toggleModal}
            onSuccess={(newModule) => {
              console.log('Module created:', newModule)
              // Refresh the modules list
              setModules((prev) => [newModule, ...prev])
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Library
