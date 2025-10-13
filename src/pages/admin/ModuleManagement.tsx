import React, { useState, useMemo } from 'react'
import { FaTrash, FaEye, FaLock, FaUnlock, FaSearch } from 'react-icons/fa'
import {
  useAdminModules,
  useDeleteModule,
} from '../../api/admin/admin.services'
import Spinner from '../../components/feedback/Spinner'

const ModuleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: modules, isLoading, error } = useAdminModules()
  const deleteModuleMutation = useDeleteModule()

  // Filter modules based on search term
  const filteredModules = useMemo(() => {
    if (!modules || !searchTerm) return modules || []

    return modules.filter(
      (module) =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.id.toString().includes(searchTerm) ||
        module.owner_id.toString().includes(searchTerm)
    )
  }, [modules, searchTerm])

  const handleDeleteModule = async (moduleId: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this module? This action cannot be undone.'
      )
    ) {
      try {
        await deleteModuleMutation.mutateAsync(moduleId)
      } catch (error) {
        console.error('Failed to delete module:', error)
      }
    }
  }

  const handleViewModule = (moduleId: number) => {
    window.open(`/module/${moduleId}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading modules. Please try again.</p>
      </div>
    )
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Module Management</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredModules?.length || 0} modules
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search modules by title, description, ID, or owner ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bfgreen-base focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredModules.length} module(s) matching &ldquo;
            {searchTerm}&rdquo;
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>{' '}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredModules?.map((module) => (
                <tr key={module.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {module.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {module.description || 'No description'}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {module.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        module.public
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {module.public ? (
                        <>
                          <FaUnlock className="w-3 h-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <FaLock className="w-3 h-3 mr-1" />
                          Private
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    User ID: {module.owner_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(module.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewModule(module.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Module"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Module"
                        disabled={deleteModuleMutation.isPending}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>{' '}
        {filteredModules?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>
              {searchTerm
                ? 'No modules found matching your search.'
                : 'No modules found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ModuleManagement
