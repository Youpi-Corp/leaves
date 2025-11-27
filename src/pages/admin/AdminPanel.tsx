import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import { useCurrentUser } from '../../api/user/user.services'
import Spinner from '../../components/feedback/Spinner'
import { FaUsers, FaBook, FaGraduationCap, FaCommentDots, FaFlag } from 'react-icons/fa'
import UserManagement from './UserManagement'
import ModuleManagement from './ModuleManagement'
import LessonManagement from './LessonManagement'
import CommentManagement from './CommentManagement'
import ReportsManagement from './ReportsManagement'

type AdminTab = 'users' | 'modules' | 'lessons' | 'comments' | 'reports'

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const { data: currentUser, isLoading } = useCurrentUser()

  // Show loading while checking user
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Check if user is admin
  const isAdmin = currentUser?.roles?.includes('admin') || false

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const tabs = [
    { id: 'users' as AdminTab, label: 'Users', icon: FaUsers },
    { id: 'modules' as AdminTab, label: 'Modules', icon: FaBook },
    { id: 'lessons' as AdminTab, label: 'Lessons', icon: FaGraduationCap },
    { id: 'comments' as AdminTab, label: 'Comments', icon: FaCommentDots },
    { id: 'reports' as AdminTab, label: 'Reports', icon: FaFlag },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />
      case 'modules':
        return <ModuleManagement />
      case 'lessons':
        return <LessonManagement />
      case 'comments':
        return <CommentManagement />
      case 'reports':
        return <ReportsManagement />
      default:
        return <UserManagement />
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-bfbase-black mb-2">
              Admin Panel
            </h1>
            <p className="text-bfbase-darkgrey">
              Manage users, modules, lessons, comments, and escalated reports
            </p>{' '}
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6 mt-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-bfgreen-base text-bfgreen-base'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">{renderTabContent()}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AdminPanel
