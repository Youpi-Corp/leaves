export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'https://sap-m1i0.onrender.com',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
    },
    USER: {
      ME: '/user/me',
      CREATE: '/user/create',
      GET: '/user/get',
      LIST: '/user/list',
      UPDATE: '/user/update',
      // Update the current user's profile (simplified for frontend)
      UPDATE_ME: '/user/update/me',
    }, COURSE: {
      CREATE: '/course/create',
      GET: '/course/get',
      UPDATE: '/course/update',
      HAS_LIKED: '/course/has-liked',
      LIKE: '/course/like',
      UNLIKE: '/course/unlike',
      NUMBER_OF_LIKES: '/course/likes-count',
      DELETE: '/course/delete',
    }, MODULE: {
      LIST: '/module/list',
      PUBLIC: '/module/public',
      GET: '/module/get',
      OWNER: '/module/owner',
      COURSES: '/module/courses',
      CREATE: '/module/create',
      UPDATE: '/module/update',
      SUBSCRIBE: '/module/subscribe',
      UNSUBSCRIBE: '/module/unsubscribe',
      SUBSCRIBED: '/module/subscribed',
      IS_SUBSCRIBED: '/module/is-subscribed',
    }
  },
} as const

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
