import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { NavigationProvider } from '../contexts/NavigationContext'
import NavigationDebugger from '../components/navigation/NavigationDebugger'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import AuthRedirect from '../components/auth/AuthRedirect'
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
import SubscriptionsPage from '../pages/SubscriptionsPage'
import AdminPanel from '../pages/admin/AdminPanel'

export const AppRoutes: React.FC = () => {
  return (
    <NavigationProvider>
      <Routes>
        {/* Redirect to login when accessing root and not authenticated */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Auth routes - redirect to home if already authenticated */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRedirect>
              <RegisterPage />
            </AuthRedirect>
          }
        />

        {/* Protected routes */}
        <Route
          path="/edition/editor/"
          element={
            <ProtectedRoute>
              <CourseEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edition/editor/:lessonId"
          element={
            <ProtectedRoute>
              <CourseEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edition/dashboard/"
          element={
            <ProtectedRoute>
              <EditorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edition/dashboard/:moduleId"
          element={
            <ProtectedRoute>
              <ModuleEditionPage />
            </ProtectedRoute>
          }
        />

        {/* Public viewing routes - still protected */}
        <Route
          path="/module/:moduleId"
          element={
            <ProtectedRoute>
              <ModuleViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <LessonViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:lessonId/content"
          element={
            <ProtectedRoute>
              <LessonContentPage />
            </ProtectedRoute>
          }
        />

        {/* User profile and settings */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <SubscriptionsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes - require admin role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiresRole={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <NavigationDebugger />
    </NavigationProvider>
  )
}
