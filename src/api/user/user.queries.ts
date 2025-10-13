import { API_CONFIG, getApiUrl } from '../config/api.config'
import { User } from '../types/user.types'

export const userQuery = async (): Promise<User> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER.ME), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  if (!response.ok) throw new Error(response.status.toString())
  return (await response.json()).data
}

export const logoutUser = async (): Promise<void> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  if (!response.ok) throw new Error(response.status.toString())
  return
}

export const exportUserData = async (): Promise<Record<string, unknown>> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER.EXPORT_DATA), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  if (!response.ok) throw new Error(response.status.toString())
  return (await response.json()).data
}

export const deleteUserAccount = async (passwordOrPhrase: string, isOAuthUser: boolean): Promise<void> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER.DELETE_ACCOUNT), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(
      isOAuthUser
        ? { validationPhrase: passwordOrPhrase }
        : { password: passwordOrPhrase }
    ),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to delete account')
  }
  return
}

export const updatePrivacySettings = async (communityUpdates: boolean): Promise<User> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER.PRIVACY_SETTINGS), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ community_updates: communityUpdates }),
  })
  if (!response.ok) throw new Error(response.status.toString())
  return (await response.json()).data
}
