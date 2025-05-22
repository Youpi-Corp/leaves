import { API_CONFIG, getApiUrl } from '../config/api.config'

export interface CourseCreateData {
  name: string;
  content: string;
  module_id: number;
  level: number;
  public: boolean;
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