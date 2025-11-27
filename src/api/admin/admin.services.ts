import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAllUsersQuery,
    getAllModulesQuery,
    getAllLessonsQuery,
    getAllRolesQuery,
    createUserQuery,
    deleteUserQuery,
    deleteModuleQuery,
    deleteLessonQuery,
    assignRoleToUserQuery,
    removeRoleFromUserQuery,
    getAdminCommentsQuery,
} from './admin.queries'

// User Management Hooks
export const useAdminUsers = () => {
    return useQuery({
        queryKey: ['admin', 'users'],
        queryFn: getAllUsersQuery,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useCreateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createUserQuery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
        },
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteUserQuery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
        },
    })
}

// Module Management Hooks
export const useAdminModules = () => {
    return useQuery({
        queryKey: ['admin', 'modules'],
        queryFn: getAllModulesQuery,
        staleTime: 1000 * 60 * 5,
    })
}

export const useDeleteModule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteModuleQuery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'modules'] })
        },
    })
}

// Lesson Management Hooks
export const useAdminLessons = () => {
    return useQuery({
        queryKey: ['admin', 'lessons'],
        queryFn: getAllLessonsQuery,
        staleTime: 1000 * 60 * 5,
    })
}

export const useDeleteLesson = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteLessonQuery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] })
        },
    })
}

export const useAdminComments = () => {
    return useQuery({
        queryKey: ['admin', 'comments'],
        queryFn: getAdminCommentsQuery,
        staleTime: 1000 * 60 * 2,
    })
}

// Role Management Hooks
export const useAdminRoles = () => {
    return useQuery({
        queryKey: ['admin', 'roles'],
        queryFn: getAllRolesQuery,
        staleTime: 1000 * 60 * 10, // 10 minutes - roles don't change often
    })
}

export const useAssignRole = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
            assignRoleToUserQuery(userId, roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
        },
    })
}

export const useRemoveRole = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
            removeRoleFromUserQuery(userId, roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
        },
    })
}
