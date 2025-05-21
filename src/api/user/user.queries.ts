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

export const updateUser = async (user: User): Promise<User> => {
  const baseUrl = getApiUrl(API_CONFIG.ENDPOINTS.USER.UPDATE);
  const updateUrl = `${baseUrl}/${user.id}`;

  const formattedUserData = {
    pseudo: user.pseudo,
    email: user.email,
    password: user.password_hash,
    role: user.role
  };

  console.log('Formatted User Data:', formattedUserData);
  console.log('Update URL:', updateUrl);
  
  const response = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(formattedUserData),
  })
  if (!response.ok) throw new Error(response.status.toString())
  return (await response.json()).data
}
