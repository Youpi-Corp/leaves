export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'https://api.brain-forest.works',
  // 'http://localhost:8080',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      GITHUB: '/auth/github',
      GITHUB_CALLBACK: '/auth/github/callback',
    },
    USER: {
      ME: '/user/me',
      CREATE: '/user/create',
      GET: '/user/get',
      LIST: '/user/list',
      UPDATE: '/user/update',
      // Update the current user's profile (simplified for frontend)
      UPDATE_ME: '/user/update/me',
      // Data privacy endpoints
      EXPORT_DATA: '/user/export-data/me',
      DELETE_ACCOUNT: '/user/delete/me',
      PRIVACY_SETTINGS: '/user/privacy-settings',
    }, COURSE: {
      CREATE: '/course/create',
      GET: '/course/get',
      UPDATE: '/course/update',
      HAS_LIKED: '/course/has-liked',
      LIKE: '/course/like',
      UNLIKE: '/course/unlike',
      NUMBER_OF_LIKES: '/course/likes-count',
      DELETE: '/course/delete',
      COMPLETE: '/course/complete',
      IS_COMPLETED: '/course/is-completed',
    },
    MODULE: {
      LIST: '/module/list',
      PUBLIC: '/module/public',
      TRENDING: '/module/trending',
      GET: '/module/get',
      OWNER: '/module/owner',
      COURSES: '/module/courses',
      CREATE: '/module/create',
      UPDATE: '/module/update',
      SUBSCRIBE: '/module/subscribe',
      UNSUBSCRIBE: '/module/unsubscribe',
      SUBSCRIBED: '/module/subscribed',
      IS_SUBSCRIBED: '/module/is-subscribed',
      IN_PROGRESS: '/module/in-progress',
      HAS_LIKED: '/module/has-liked',
      LIKE: '/module/like',
      UNLIKE: '/module/unlike',
      NUMBER_OF_LIKES: '/module/likes-count',
      DELETE: '/module/delete',
    }, MODULE_COMMENT: {
      GET_BY_MODULE: '/module-comment',
      GET_BY_ID: '/module-comment/comment',
      CREATE: '/module-comment/create',
      UPDATE: '/module-comment/update',
      DELETE: '/module-comment/delete',
      GET_BY_USER: '/module-comment/user',
      ADMIN: '/module-comment/admin',
    }, REPORT: {
      CREATE: '/report',
      REASONS: '/report/reasons',
      DETAILS: '/report/details',
      SUMMARY: '/report/admin/summary',
      TARGET_STATUS: '/report/target',
    }
  },
} as const

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
