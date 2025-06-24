import { getApiUrl } from '../config/api.config'

export interface AdminUser {
    id: number
    pseudo?: string
    email: string
    biography?: string
    profile_picture?: string
    roles: string[]
    created_at: string
    updated_at: string
}

export interface CreateUserRequest {
    pseudo?: string
    email: string
    password: string
    roles?: string[]
    biography?: string
    profile_picture?: string
}

export interface AdminModule {
    id: number
    title: string
    description?: string
    public: boolean
    owner_id: number
    created_at: string
    updated_at: string
}

export interface AdminLesson {
    id: number
    title: string
    content?: string
    public: boolean
    owner_id: number
    created_at: string
    updated_at: string
}

// Helper function to make API calls
const makeApiCall = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    if (!data.success) {
        throw new Error(data.message || 'API call failed')
    }

    return data.data
}

// User Management
export const getAllUsersQuery = async (): Promise<AdminUser[]> => {
    return makeApiCall(getApiUrl('/user/list'))
}

export const createUserQuery = async (userData: CreateUserRequest): Promise<AdminUser> => {
    return makeApiCall(getApiUrl('/user/create'), {
        method: 'POST',
        body: JSON.stringify(userData),
    })
}

export const deleteUserQuery = async (userId: number): Promise<void> => {
    await makeApiCall(getApiUrl(`/user/delete/${userId}`), {
        method: 'DELETE',
    })
}

// Module Management
export const getAllModulesQuery = async (): Promise<AdminModule[]> => {
    return makeApiCall(getApiUrl('/module/list'))
}

export const deleteModuleQuery = async (moduleId: number): Promise<void> => {
    await makeApiCall(getApiUrl(`/module/delete/${moduleId}`), {
        method: 'DELETE',
    })
}

// Lesson Management (using course endpoints since lessons are courses)
export const getAllLessonsQuery = async (): Promise<AdminLesson[]> => {
    return makeApiCall(getApiUrl('/course/list'))
}

export const deleteLessonQuery = async (lessonId: number): Promise<void> => {
    await makeApiCall(getApiUrl(`/course/delete/${lessonId}`), {
        method: 'DELETE',
    })
}

// Role Management
export const getAllRolesQuery = async (): Promise<{ id: number; name: string; description?: string }[]> => {
    return makeApiCall(getApiUrl('/role/list'))
}

export const assignRoleToUserQuery = async (userId: number, roleId: number): Promise<void> => {
    await makeApiCall(getApiUrl('/role/assign'), {
        method: 'POST',
        body: JSON.stringify({ userId, roleId }),
    })
}

export const removeRoleFromUserQuery = async (userId: number, roleId: number): Promise<void> => {
    await makeApiCall(getApiUrl('/role/remove'), {
        method: 'DELETE',
        body: JSON.stringify({ userId, roleId }),
    })
}
