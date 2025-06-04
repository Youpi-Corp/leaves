import { API_CONFIG, getApiUrl } from '../config/api.config'
import { ApiResponse } from '../module/module.queries'

export interface Course {
  id: number
  name: string
  content: string | null
  description: string | null
  level: number
  likes?: number
  public: boolean
  module_id: number
}

export interface CourseCreateData {
  name: string;
  content: string;
  module_id: number;
  level: number;
  likes?: number;
  public: boolean;
}

export const getCourseByIdQuery = async (courseId: number): Promise<Course> => {
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.COURSE.GET}/${courseId}`), {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) throw new Error(response.status.toString())
  return (await response.json()).data
}

export const createCourseQuery = async (courseData: CourseCreateData) => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COURSE.CREATE), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(courseData),
  })

  if (!response.ok) throw new Error(response.status.toString())
  return (await response.json()).data
}

export const updateCourseQuery = async (courseId: number, courseData: Partial<CourseCreateData>) => {
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.COURSE.UPDATE}/${courseId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(courseData),
  })

  if (!response.ok) throw new Error(response.status.toString())
  return (await response.json()).data
}

export const hasLikedCourseQuery = async (courseId: number): Promise<boolean> => {
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.COURSE.HAS_LIKED}/${courseId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  
  if (!response.ok) {
    console.error('hasLikedCourseQuery failed with status:', response.status)
    throw new Error(response.status.toString())
  }

  const result: ApiResponse<{ hasLiked: boolean }> = await response.json()
  return result.data.hasLiked
}

export const likeCourseQuery = async (courseId: number) => {
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.COURSE.LIKE}/${courseId}`), {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
        throw new Error(`Failed to like a course: ${response.status}`)
    }

    const result: ApiResponse<{ liked: boolean }> = await response.json()
    return result.data.liked
}

export const unlikeCourseQuery = async (courseId: number) => {
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.COURSE.UNLIKE}/${courseId}`), {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
        throw new Error(`Failed to unlike a course: ${response.status}`)
    }

    const result: ApiResponse<{ unliked: boolean }> = await response.json()
    return result.data.unliked
}

export const getNumberOfLikesQuery = async (courseId: number): Promise<number> => {
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.COURSE.NUMBER_OF_LIKES}/${courseId}`), {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    console.error('getNumberOfLikesQuery failed with status:', response.status)
    throw new Error(response.status.toString())
  }
  
  const result: ApiResponse<{ likesCount: number }> = await response.json()
  return result.data.likesCount
}

export const deleteCourseQuery = async (courseId: number) => {
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.COURSE.DELETE}/${courseId}`), {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    console.error('deleteCourseQuery failed with status:', response.status)
    throw new Error(response.status.toString())
  }

  return (await response.json()).data
}