import { keepPreviousData, useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { userQuery, logoutUser } from './user.queries'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  const handleLogout = async () => {
    console.log('Logging out...')
    try {
      console.log('Calling logoutUser...')
      await logoutUser()
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.removeQueries({ queryKey: ['user'] })
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
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
