import { API_CONFIG, getApiUrl } from '../config/api.config'
import { useCurrentUser } from '../user/user.services'
import { Module } from './module.queries'
import { useQuery } from '@tanstack/react-query'

/**
 * Custom hook to fetch modules owned by the current user
 */
export const useUserModules = () => {
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()

    return useQuery({
        queryKey: ['userModules', currentUser?.id],
        queryFn: async () => {
            if (!currentUser?.id) {
                return []
            }

            const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.OWNER}/${currentUser.id}`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch user modules: ${response.status}`)
            }

            const result = await response.json()
            return result.data as Module[]
        },
        enabled: !!currentUser?.id && !isUserLoading,
    })
}
