import { API_CONFIG, getApiUrl } from '../config/api.config'
import { User } from '../types/user.types'

export interface UpdateUserRequest {
    pseudo?: string
    email?: string
    password?: string
    biography?: string
    profile_picture?: string
}

export const updateUserProfile = async (data: UpdateUserRequest): Promise<User> => {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.USER.UPDATE_ME}`), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        // Handle specific error cases
        if (response.status === 413) {
            throw new Error('Profile picture exceeds maximum size of 2MB')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to update profile: ${response.status}`)
    }

    return (await response.json()).data
}
