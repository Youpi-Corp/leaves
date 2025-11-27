import { API_CONFIG, getApiUrl } from '../config/api.config'
import { useCurrentUser } from '../user/user.services'
import { Module } from './module.queries'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    checkModuleSubscriptionQuery,
    subscribeToModuleQuery,
    unsubscribeFromModuleQuery,
    getSubscribedModulesQuery,
    hasLikedModuleQuery,
    likeModuleQuery,
    unlikeModuleQuery,
    getModuleLikesCountQuery
} from './module.queries'

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

/**
 * Hook to check if user is subscribed to a module
 */
export const useModuleSubscription = (moduleId: number) => {
    return useQuery({
        queryKey: ['moduleSubscription', moduleId],
        queryFn: () => checkModuleSubscriptionQuery(moduleId),
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

/**
 * Hook to get all modules user is subscribed to
 */
export const useSubscribedModules = () => {
    return useQuery({
        queryKey: ['subscribedModules'],
        queryFn: getSubscribedModulesQuery,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

/**
 * Hook to fetch whether the current user liked a module
 */
export const useModuleLikeStatus = (moduleId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['moduleLikeStatus', moduleId],
        queryFn: () => hasLikedModuleQuery(moduleId),
        enabled: !!moduleId && enabled,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    })
}

/**
 * Hook to fetch module likes count
 */
export const useModuleLikesCount = (moduleId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['moduleLikesCount', moduleId],
        queryFn: () => getModuleLikesCountQuery(moduleId),
        enabled: !!moduleId && enabled,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    })
}

/**
 * Hook to subscribe to a module
 */
export const useSubscribeToModule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: subscribeToModuleQuery,
        onSuccess: (_, moduleId) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['moduleSubscription', moduleId] })
            queryClient.invalidateQueries({ queryKey: ['subscribedModules'] })
        },
    })
}

/**
 * Hook to unsubscribe from a module
 */
export const useUnsubscribeFromModule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: unsubscribeFromModuleQuery,
        onSuccess: (_, moduleId) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['moduleSubscription', moduleId] })
            queryClient.invalidateQueries({ queryKey: ['subscribedModules'] })
        },
    })
}

/**
 * Hook to like a module
 */
export const useLikeModule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: likeModuleQuery,
        onSuccess: (_, moduleId) => {
            queryClient.invalidateQueries({ queryKey: ['moduleLikeStatus', moduleId] })
            queryClient.invalidateQueries({ queryKey: ['moduleLikesCount', moduleId] })
        },
    })
}

/**
 * Hook to unlike a module
 */
export const useUnlikeModule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: unlikeModuleQuery,
        onSuccess: (_, moduleId) => {
            queryClient.invalidateQueries({ queryKey: ['moduleLikeStatus', moduleId] })
            queryClient.invalidateQueries({ queryKey: ['moduleLikesCount', moduleId] })
        },
    })
}
