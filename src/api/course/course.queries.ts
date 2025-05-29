import { API_CONFIG, getApiUrl } from '../config/api.config'

export interface Course {
  id: number
  name: string
  content: string | null
  description: string | null
  level: number
  public: boolean
  module_id: number
}

export interface CourseCreateData {
  name: string;
  content: string;
  module_id: number;
  level: number;
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