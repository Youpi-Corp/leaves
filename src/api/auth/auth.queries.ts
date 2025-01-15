import { API_CONFIG, getApiUrl } from '../config/api.config'
import { LoginCredentials } from '../types/auth.types'

export const loginQuery = async (credentials: LoginCredentials) => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
  if (!response.ok) throw new Error(response.status.toString())
  return await response.json()
}
