export const API_CONFIG = {
  BASE_URL: 'https://brainforest-ozct.shuttle.app',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
    },
    USER: {
      CREATE: '/user/create',
      GET: '/user/get',
      LIST: '/user/list',
      UPDATE: '/user/update',
    },
  },
} as const

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
