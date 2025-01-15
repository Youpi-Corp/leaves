export const API_CONFIG = {
  BASE_URL: 'https://brainforest-ozct.shuttle.app',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
    },
  },
} as const

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
