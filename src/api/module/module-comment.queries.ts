import { API_CONFIG, getApiUrl } from '../config/api.config'

export interface ModuleComment {
    id: number
    module_id: number
    user_id: number
    content: string
    created_at: string
    updated_at: string
}

export interface ModuleCommentCreateData {
    module_id: number
    content: string
}

export const getModuleCommentsQuery = async (moduleId: number): Promise<ModuleComment[]> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE_COMMENT.GET_BY_MODULE}/${moduleId}`), {
        method: 'GET',
        credentials: 'include',
    })

    if (!response.ok) throw new Error(response.status.toString())
    return (await response.json()).data
}

export const createModuleCommentQuery = async (commentData: ModuleCommentCreateData): Promise<ModuleComment> => {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MODULE_COMMENT.CREATE), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(commentData),
    })

    if (!response.ok) throw new Error(response.status.toString())
    return (await response.json()).data
}

export const updateModuleCommentQuery = async (commentId: number, content: string): Promise<ModuleComment> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE_COMMENT.UPDATE}/${commentId}`), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
    })

    if (!response.ok) throw new Error(response.status.toString())
    return (await response.json()).data
}

export const deleteModuleCommentQuery = async (commentId: number): Promise<void> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE_COMMENT.DELETE}/${commentId}`), {
        method: 'DELETE',
        credentials: 'include',
    })

    if (!response.ok) throw new Error(response.status.toString())
}