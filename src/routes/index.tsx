import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import CourseEditorPage from '../pages/course/CourseEditorPage'
import HomePage from '../pages/HomePage'
import RegisterPage from '../pages/auth/RegisterPage'
import ProfilePage from '../pages/ProfilePage'

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/editor" element={<CourseEditorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}
