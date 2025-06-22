import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import CourseEditorPage from '../pages/course/editor/CourseEditorPage'
import HomePage from '../pages/HomePage'
import RegisterPage from '../pages/auth/RegisterPage'
import EditorDashboard from '../pages/course/EditorDashboard'
import ModuleEditionPage from '../pages/course/ModuleEditionPage'
import ModuleViewPage from '../pages/course/ModuleViewPage'
import LessonViewPage from '../pages/course/LessonViewPage'
import LessonContentPage from '../pages/course/LessonContentPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/ProfilePage'
import Library from '../pages/library/Library'

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/edition/editor/" element={<CourseEditorPage />} />
        <Route
          path="/edition/editor/:lessonId"
          element={<CourseEditorPage />}
        />
        <Route path="/edition/dashboard/" element={<EditorDashboard />} />
        <Route
          path="/edition/dashboard/:moduleId"
          element={<ModuleEditionPage />}
        />{' '}
        {/* Public viewing routes */}
        <Route path="/module/:moduleId" element={<ModuleViewPage />} />
        <Route path="/lesson/:lessonId" element={<LessonViewPage />} />
        <Route
          path="/lesson/:lessonId/content"
          element={<LessonContentPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/editor" element={<CourseEditorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </BrowserRouter>
  )
}
