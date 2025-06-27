import { keepPreviousData, useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { userQuery, logoutUser } from './user.queries'
import { UpdateUserRequest, updateUserProfile } from './user.mutations'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: userQuery,
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    console.log('Logging out...')
    try {
      console.log('Calling logoutUser...')
      await logoutUser()

      // Clear all user-related data from cache
      queryClient.setQueryData(['user'], null)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.removeQueries({ queryKey: ['user'] })

      // Clear all cached queries to ensure a clean state
      queryClient.clear()

      console.log('Logout successful')
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout API call fails, clear local cache
      queryClient.setQueryData(['user'], null)
      queryClient.clear()
    }
  }

  return { logout: handleLogout }
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUserProfile(data),
    onSuccess: () => {
      // Invalidate the user query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
