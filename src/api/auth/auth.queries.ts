import { API_CONFIG, getApiUrl } from '../config/api.config'
import { LoginCredentials, RegisterCredentials } from '../types/auth.types'
import { User } from '../types/user.types'

export const loginQuery = async (credentials: LoginCredentials) => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })
  if (!response.ok) throw new Error(response.status.toString())
  return (await response.json()).data
}

export const registerQuery = async (
  user: RegisterCredentials
): Promise<User> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  if (!response.ok) throw new Error(response.status.toString())
  return (await response.json()).data
}
