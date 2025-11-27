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
    credentials: 'include',
    body: JSON.stringify(user),
  })

  let body: any = null
  try {
    body = await response.json()
  } catch (error) {
    // Ignore JSON parsing issues and fall back to the defaults below
  }

  if (!response.ok) {
    const message =
      body?.message ||
      body?.data?.message ||
      body?.error ||
      body?.errors?.[0]?.message ||
      `Registration failed (${response.status}).`

    throw new Error(message)
  }

  return body?.data
}
