import { API_CONFIG, getApiUrl } from '../config/api.config'
import { LoginCredentials, RegisterCredentials } from '../types/auth.types'
import { User } from '../types/user.types'

type RegisterResponse = {
  data?: unknown
  message?: string
  error?: string
  errors?: Array<{ message?: string }>
  [key: string]: unknown
}

const extractMessage = (payload: RegisterResponse | null): string | undefined => {
  if (!payload) return undefined

  const nestedMessage = (() => {
    const value = payload.data
    if (value && typeof value === 'object' && 'message' in value) {
      const maybeMessage = (value as { message?: unknown }).message
      return typeof maybeMessage === 'string' ? maybeMessage : undefined
    }
    return undefined
  })()

  return (
    (typeof payload.message === 'string' ? payload.message : undefined) ||
    (typeof payload.error === 'string' ? payload.error : undefined) ||
    payload.errors?.find((entry) => typeof entry?.message === 'string')?.message ||
    nestedMessage
  )
}

const isUser = (value: unknown): value is User => {
  if (!value || typeof value !== 'object') return false
  return 'id' in value && 'email' in value && 'pseudo' in value
}

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

  let body: RegisterResponse | null = null
  try {
    body = (await response.json()) as RegisterResponse
  } catch {
    // Ignore JSON parsing issues and fall back to the defaults below
  }

  if (!response.ok) {
    const message =
      extractMessage(body) || `Registration failed (${response.status}).`

    throw new Error(message)
  }

  if (!body || !isUser(body.data)) {
    throw new Error('Registration failed: response payload missing user data.')
  }

  return body.data
}
