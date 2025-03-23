export const API_CONFIG = {
  BASE_URL: 'https://sap-m1i0.onrender.com',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
    },
    USER: {
      ME: '/user/me',
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
