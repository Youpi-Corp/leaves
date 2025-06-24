import React, { useState, useMemo } from 'react'
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaUserPlus,
  FaUserMinus,
  FaSearch,
} from 'react-icons/fa'
import {
  useAdminUsers,
  useCreateUser,
  useDeleteUser,
  useAdminRoles,
  useAssignRole,
  useRemoveRole,
} from '../../api/admin/admin.services'
import { AdminUser, CreateUserRequest } from '../../api/admin/admin.queries'
import Spinner from '../../components/feedback/Spinner'

const UserManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useAdminUsers()
  const { data: roles } = useAdminRoles()
  const createUserMutation = useCreateUser()
  const deleteUserMutation = useDeleteUser()
  const assignRoleMutation = useAssignRole()
  const removeRoleMutation = useRemoveRole()

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!users || !searchTerm) return users || []

    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.pseudo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm) ||
        user.roles?.some((role) =>
          role.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
  }, [users, searchTerm])

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      await createUserMutation.mutateAsync(userData)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserMutation.mutateAsync(userId)
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  const handleAssignRole = async (userId: number, roleId: number) => {
    try {
      await assignRoleMutation.mutateAsync({ userId, roleId })
    } catch (error) {
      console.error('Failed to assign role:', error)
    }
  }

  const handleRemoveRole = async (userId: number, roleId: number) => {
    try {
      await removeRoleMutation.mutateAsync({ userId, roleId })
    } catch (error) {
      console.error('Failed to remove role:', error)
    }
  }

  if (usersLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (usersError) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading users. Please try again.</p>
      </div>
    )
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-bfgreen-base hover:bg-bfgreen-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users by name, email, ID, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bfgreen-base focus:border-transparent"
          />
        </div>{' '}
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredUsers.length} user(s) matching &ldquo;{searchTerm}
            &rdquo;
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
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
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-bfgreen-base flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.pseudo?.[0] || user.email[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.pseudo || 'No username'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setIsRoleModalOpen(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Manage Roles"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete User"
                        disabled={deleteUserMutation.isPending}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateUser}
          isLoading={createUserMutation.isPending}
          roles={roles || []}
        />
      )}

      {/* Role Management Modal */}
      {isRoleModalOpen && selectedUser && (
        <RoleManagementModal
          isOpen={isRoleModalOpen}
          onClose={() => {
            setIsRoleModalOpen(false)
            setSelectedUser(null)
          }}
          user={selectedUser}
          roles={roles || []}
          onAssignRole={handleAssignRole}
          onRemoveRole={handleRemoveRole}
          isAssigning={assignRoleMutation.isPending}
          isRemoving={removeRoleMutation.isPending}
        />
      )}
    </div>
  )
}

// Create User Modal Component
interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateUserRequest) => void
  isLoading: boolean
  roles: { id: number; name: string }[]
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  roles,
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    password: '',
    pseudo: '',
    roles: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.pseudo || ''}
                onChange={(e) =>
                  setFormData({ ...formData, pseudo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roles
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {roles.map((role) => (
                  <label key={role.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.roles?.includes(role.name) || false}
                      onChange={(e) => {
                        const newRoles = formData.roles || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            roles: [...newRoles, role.name],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            roles: newRoles.filter((r) => r !== role.name),
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{role.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-bfgreen-base text-white rounded-md hover:bg-bfgreen-dark disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Role Management Modal Component
interface RoleManagementModalProps {
  isOpen: boolean
  onClose: () => void
  user: AdminUser
  roles: { id: number; name: string }[]
  onAssignRole: (userId: number, roleId: number) => void
  onRemoveRole: (userId: number, roleId: number) => void
  isAssigning: boolean
  isRemoving: boolean
}

const RoleManagementModal: React.FC<RoleManagementModalProps> = ({
  isOpen,
  onClose,
  user,
  roles,
  onAssignRole,
  onRemoveRole,
  isAssigning,
  isRemoving,
}) => {
  if (!isOpen) return null

  const userRoles = user.roles || []
  const availableRoles = roles.filter((role) => !userRoles.includes(role.name))
  const assignedRoles = roles.filter((role) => userRoles.includes(role.name))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Manage Roles for {user.pseudo || user.email}
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Assigned Roles</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {assignedRoles.length > 0 ? (
                assignedRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between bg-blue-50 p-2 rounded"
                  >
                    <span className="text-sm">{role.name}</span>
                    <button
                      onClick={() => onRemoveRole(user.id, role.id)}
                      disabled={isRemoving}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Remove Role"
                    >
                      <FaUserMinus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No roles assigned</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Available Roles</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableRoles.length > 0 ? (
                availableRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">{role.name}</span>
                    <button
                      onClick={() => onAssignRole(user.id, role.id)}
                      disabled={isAssigning}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Assign Role"
                    >
                      <FaUserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">All roles assigned</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
