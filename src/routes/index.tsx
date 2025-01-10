import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/login/LoginPage'
import CourseEditorPage from '../pages/course/CourseEditorPage'

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/editor" element={<CourseEditorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
