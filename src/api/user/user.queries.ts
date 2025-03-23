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
