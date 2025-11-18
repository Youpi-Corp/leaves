import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getModuleCommentsQuery,
    createModuleCommentQuery,
    updateModuleCommentQuery,
    deleteModuleCommentQuery,
} from './module-comment.queries'

export const useModuleComments = (moduleId: number) => {
    return useQuery({
        queryKey: ['moduleComments', moduleId],
        queryFn: () => getModuleCommentsQuery(moduleId),
        retry: 1,
        staleTime: 1000 * 60 * 2,
    })
}

export const useCreateModuleComment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createModuleCommentQuery,
        onSuccess: (newComment) => {
            queryClient.invalidateQueries({ queryKey: ['moduleComments', newComment.module_id] })
        },
    })
}

export const useUpdateModuleComment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
            updateModuleCommentQuery(commentId, content),
        onSuccess: (updatedComment) => {
            queryClient.invalidateQueries({ queryKey: ['moduleComments', updatedComment.module_id] })
        },
    })
}

export const useDeleteModuleComment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteModuleCommentQuery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moduleComments'] })
        },
    })
}