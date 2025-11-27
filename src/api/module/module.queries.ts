import { API_CONFIG, getApiUrl } from '../config/api.config'

export interface Module {
    id: number
    title: string | null
    description: string | null
    owner_id: number | null
    courses_count: number | null
    public: boolean
    dtc: string | null
    dtm: string | null
}

export interface Course {
    id: number
    name: string | null
    content: string | null
    module_id: number | null
    level: number | null
    likes: number | null
    views: number | null
    public: boolean | null
    chat_id: number | null
    owner_id: number | null
}

export interface ModuleCreateData {
    title: string
    description?: string
    public?: boolean
}

export interface ApiResponse<T> {
    data: T
    message?: string
}

/**
 * Fetch all modules (requires authentication)
 */
export const getAllModulesQuery = async (): Promise<Module[]> => {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MODULE.LIST), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch modules: ${response.status}`)
    }

    const result: ApiResponse<Module[]> = await response.json()
    return result.data
}

/**
 * Fetch public modules (no authentication required)
 */
export const getPublicModulesQuery = async (): Promise<Module[]> => {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MODULE.PUBLIC), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch public modules: ${response.status}`)
    }

    const result: ApiResponse<Module[]> = await response.json()
    return result.data
}

/**
 * Fetch trending modules (most liked in the past week, no authentication required)
 */
export const getTrendingModulesQuery = async (): Promise<Module[]> => {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MODULE.TRENDING), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch trending modules: ${response.status}`)
    }

    const result: ApiResponse<Module[]> = await response.json()
    return result.data
}

/**
 * Fetch a specific module by ID
 */
export const getModuleByIdQuery = async (moduleId: number): Promise<Module> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.GET}/${moduleId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Module not found')
        }
        if (response.status === 403) {
            throw new Error('Not authorized to access this module')
        }
        throw new Error(`Failed to fetch module: ${response.status}`)
    }

    const result: ApiResponse<Module> = await response.json()
    return result.data
}

/**
 * Fetch modules by owner ID (requires authentication)
 */
export const getModulesByOwnerQuery = async (ownerId: number): Promise<Module[]> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.OWNER}/${ownerId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch modules by owner: ${response.status}`)
    }

    const result: ApiResponse<Module[]> = await response.json()
    return result.data
}

/**
 * Fetch courses for a specific module
 */
export const getModuleCoursesQuery = async (moduleId: number): Promise<Course[]> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.COURSES}/${moduleId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Module not found')
        }
        if (response.status === 403) {
            throw new Error('Not authorized to access this module')
        }
        throw new Error(`Failed to fetch module courses: ${response.status}`)
    } const result: ApiResponse<Course[]> = await response.json()
    return result.data
}

/**
 * Create a new module
 */
export const createModuleQuery = async (moduleData: ModuleCreateData): Promise<Module> => {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MODULE.CREATE), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(moduleData),
    })

    if (!response.ok) {
        throw new Error(`Failed to create module: ${response.status}`)
    }

    const result: ApiResponse<Module> = await response.json()
    return result.data
}

/**
 * Update an existing module
 */
export const updateModuleQuery = async (moduleId: number, moduleData: Partial<ModuleCreateData>): Promise<Module> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.UPDATE}/${moduleId}`), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(moduleData),
    })

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Module not found')
        }
        if (response.status === 403) {
            throw new Error('Not authorized to update this module')
        }
        throw new Error(`Failed to update module: ${response.status}`)
    }

    const result: ApiResponse<Module> = await response.json()
    return result.data
}

/**
 * Check if user is subscribed to a module
 */
export const checkModuleSubscriptionQuery = async (moduleId: number): Promise<boolean> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.IS_SUBSCRIBED}/${moduleId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to check subscription status: ${response.status}`)
    }

    const result: ApiResponse<{ isSubscribed: boolean }> = await response.json()
    return result.data.isSubscribed
}

/**
 * Subscribe to a module
 */
export const subscribeToModuleQuery = async (moduleId: number): Promise<boolean> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.SUBSCRIBE}/${moduleId}`), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to subscribe to module: ${response.status}`)
    }

    const result: ApiResponse<{ subscribed: boolean }> = await response.json()
    return result.data.subscribed
}

/**
 * Unsubscribe from a module
 */
export const unsubscribeFromModuleQuery = async (moduleId: number): Promise<boolean> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.UNSUBSCRIBE}/${moduleId}`), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to unsubscribe from module: ${response.status}`)
    }

    const result: ApiResponse<{ unsubscribed: boolean }> = await response.json()
    return result.data.unsubscribed
}

/**
 * Check if the authenticated user liked a module
 */
export const hasLikedModuleQuery = async (moduleId: number): Promise<boolean> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.HAS_LIKED}/${moduleId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Module not found')
        }
        throw new Error(`Failed to fetch like status: ${response.status}`)
    }

    const result: ApiResponse<{ hasLiked: boolean }> = await response.json()
    return result.data.hasLiked
}

/**
 * Like a module
 */
export const likeModuleQuery = async (moduleId: number): Promise<boolean> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.LIKE}/${moduleId}`), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Module not found')
        }
        throw new Error(`Failed to like module: ${response.status}`)
    }

    const result: ApiResponse<{ liked: boolean }> = await response.json()
    return result.data.liked
}

/**
 * Unlike a module
 */
export const unlikeModuleQuery = async (moduleId: number): Promise<boolean> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.UNLIKE}/${moduleId}`), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Module not found')
        }
        throw new Error(`Failed to unlike module: ${response.status}`)
    }

    const result: ApiResponse<{ unliked: boolean }> = await response.json()
    return result.data.unliked
}

/**
 * Get the number of likes for a module
 */
export const getModuleLikesCountQuery = async (moduleId: number): Promise<number> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.NUMBER_OF_LIKES}/${moduleId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Module not found')
        }
        throw new Error(`Failed to fetch module likes: ${response.status}`)
    }

    const result: ApiResponse<{ likesCount: number }> = await response.json()
    return result.data.likesCount
}

/**
 * Get modules user is subscribed to
 */
export const getSubscribedModulesQuery = async (): Promise<Module[]> => {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MODULE.SUBSCRIBED), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch subscribed modules: ${response.status}`)
    }

    const result: ApiResponse<Module[]> = await response.json()
    return result.data
}

/**
 * Get modules user has started but not completed
 */
export const getInProgressModulesQuery = async (): Promise<Module[]> => {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MODULE.IN_PROGRESS), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch in-progress modules: ${response.status}`)
    }

    const result: ApiResponse<Module[]> = await response.json()
    return result.data
}

/**
 * Delete a module
 */
export const deleteModuleQuery = async (moduleId: number): Promise<boolean> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.MODULE.DELETE}/${moduleId}`), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Module not found')
        }
        if (response.status === 403) {
            throw new Error('Not authorized to delete this module')
        }
        throw new Error(`Failed to delete module: ${response.status}`)
    }

    const result: ApiResponse<{ deleted: boolean }> = await response.json()
    return result.data.deleted
}
