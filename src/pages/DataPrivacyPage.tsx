import React, { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import { userQuery, exportUserData, deleteUserAccount, updatePrivacySettings } from '../api/user/user.queries'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FaShieldAlt, FaEye, FaTrash, FaDownload, FaCog } from 'react-icons/fa'
import UserLayout from '../components/layout/UserLayout'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/feedback/Modal'

const DataPrivacyPage: React.FC = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [showDataReport, setShowDataReport] = useState(false)
  const [dataReport, setDataReport] = useState<Record<string, unknown> | null>(null)

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => userQuery(),
  })

  // Export data mutation
  const exportMutation = useMutation({
    mutationFn: exportUserData,
    onSuccess: (data) => {
      // Create a downloadable JSON file
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `brainforest-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
  })

  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: ({ passwordOrPhrase, isOAuthUser }: { passwordOrPhrase: string, isOAuthUser: boolean }) =>
      deleteUserAccount(passwordOrPhrase, isOAuthUser),
    onSuccess: () => {
      queryClient.clear()
      navigate('/login')
    },
    onError: (error: Error) => {
      setDeleteError(error.message || 'Failed to delete account')
    },
  })

  // Privacy settings mutation
  const privacyMutation = useMutation({
    mutationFn: updatePrivacySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const handleExportData = () => {
    exportMutation.mutate()
  }

  const handleDeleteAccount = () => {
    const isOAuthUser = !user?.password_hash
    if (!deletePassword) {
      setDeleteError(isOAuthUser ? 'Please enter the validation phrase' : 'Please enter your password')
      return
    }
    setDeleteError('')
    deleteMutation.mutate({ passwordOrPhrase: deletePassword, isOAuthUser })
  }

  const handlePrivacyToggle = (checked: boolean) => {
    privacyMutation.mutate(checked)
  }

  const handleViewDataReport = async () => {
    try {
      const data = await exportUserData()
      setDataReport(data)
      setShowDataReport(true)
    } catch (error) {
      console.error('Failed to fetch data report:', error)
    }
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <UserLayout userRole={undefined} isAuthenticated={false}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-bfgreen-base border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </UserLayout>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <UserLayout userRole={undefined} isAuthenticated={false}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">
                Error loading user data
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-bfgreen-base text-white rounded hover:bg-bfgreen-dark"
              >
                Try Again
              </button>
            </div>
          </div>
        </UserLayout>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <UserLayout userRole={user?.roles} isAuthenticated={!!user}>
        <div className="max-w-6xl mx-auto">
          {/* Welcome section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-bfgreen-base">Data & Privacy</span> Information
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Learn about how BrainForest, as a non-profit, open source, community-driven platform, handles your information
            </p>
          </div>

          {/* Privacy Overview Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-6">
              <FaShieldAlt className="text-3xl text-bfgreen-base mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Our Privacy Commitment</h2>
            </div>
            <div className="bg-bfgreen-white border-l-4 border-bfgreen-base p-4 mb-4">
              <p className="text-gray-700">
                As a non-profit, open source, community-driven organization, we are committed to protecting your privacy. We collect only the minimal data necessary to provide you with a great learning experience and we never sell or monetize your personal information.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-bfgreen-base mb-2">Non-Profit</div>
                <p className="text-sm text-gray-600">We don&apos;t sell your data</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-bfgreen-base mb-2">Open Source</div>
                <p className="text-sm text-gray-600">Transparent and community-built</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-bfgreen-base mb-2">Community</div>
                <p className="text-sm text-gray-600">Driven by learners like you</p>
              </div>
            </div>
          </div>

          {/* Data Management Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Personal Data */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Personal Data</h3>
                <FaEye className="text-2xl text-bfgreen-base" />
              </div>
              <p className="text-gray-600 mb-4">
                View and manage the personal information we have about you.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Profile Information</span>
                  <span className="text-sm text-gray-600">Name, email, bio</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded">
                  <span className="text-sm font-medium text-gray-700">Learning Progress</span>
                  <span className="text-sm text-gray-600">Courses, modules, scores</span>
                </div>
                <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Account Settings</span>
                  <span className="text-sm text-gray-600">Preferences, roles</span>
                </div>
              </div>
              <button 
                onClick={handleViewDataReport}
                className="w-full px-4 py-2 bg-bfgreen-base text-white rounded hover:bg-bfgreen-dark transition-colors"
              >
                View Full Data Report
              </button>
            </div>

            {/* Privacy Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Community Settings</h3>
                <FaCog className="text-2xl text-bfgreen-base" />
              </div>
              <p className="text-gray-600 mb-4">
                Configure your preferences for community participation and updates.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Community Updates</div>
                    <div className="text-sm text-gray-500">Receive news and updates about BrainForest</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={user?.community_updates || false}
                      onChange={(e) => handlePrivacyToggle(e.target.checked)}
                      disabled={privacyMutation.isPending}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bfgreen-base/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bfgreen-base"></div>
                  </label>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> As an open source project, we believe in transparency and community collaboration. Your public profile helps other learners discover and connect with you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Download Data */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Download Your Data</h3>
                <FaDownload className="text-2xl text-blue-500" />
              </div>
              <p className="text-gray-600 mb-4">
                Get a copy of all your personal data stored in BrainForest in a portable format.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Data exports include your profile information, learning progress, and course data. The export will be available for download within 24 hours.
                </p>
              </div>
              <button 
                onClick={handleExportData}
                disabled={exportMutation.isPending}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportMutation.isPending ? 'Preparing Export...' : 'Request Data Export'}
              </button>
            </div>

            {/* Delete Account */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Delete Account</h3>
                <FaTrash className="text-2xl text-red-500" />
              </div>
              <p className="text-gray-600 mb-4">
                Permanently delete your BrainForest account and all associated data.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This action cannot be undone. All your courses, progress, and personal data will be permanently deleted.
                </p>
              </div>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete My Account
              </button>
            </div>
          </div>

          {/* Data Usage Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">How We Handle Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Essential Platform Functions</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-bfgreen-base rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Account creation and authentication
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-bfgreen-base rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Saving your learning progress and preferences
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-bfgreen-base rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Displaying your public profile to the community
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-bfgreen-base rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Technical support and platform maintenance
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Community Features</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Connecting learners with similar interests
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Sharing educational content and resources
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Facilitating collaborative learning experiences
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Platform news and community updates (if opted in)
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">What We DON&apos;T Do</h5>
              <ul className="space-y-1 text-green-700 text-sm">
                <li>• We never sell your personal information to third parties</li>
                <li>• We don&apos;t use your data for advertising or marketing purposes</li>
                <li>• We don&apos;t track you across other websites or services</li>
                <li>• We don&apos;t share your data with commercial partners</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Questions About Privacy or Our Mission?</h3>
            <p className="text-gray-600 mb-4">
              As an open source, community-driven project, we&apos;re committed to transparency. If you have questions about how we handle data or want to contribute to our privacy practices, we&apos;d love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://discord.gg/W2jeRP6m"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-bfgreen-base text-white rounded hover:bg-bfgreen-dark transition-colors text-center"
              >
                Contact Community Team
              </a>
              <a
                href="https://github.com/Youpi-Corp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors text-center"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </UserLayout>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        className="max-w-md w-full"
      >
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Delete Account</h3>
          {user?.password_hash ? (
            <p className="text-gray-600 mb-4">
              This action cannot be undone. All your data will be permanently deleted. Please enter your password to confirm.
            </p>
          ) : (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <p className="text-gray-700 font-medium">
                Please type <span className="font-bold text-red-600">delete my account</span> to confirm.
              </p>
            </div>
          )}

          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 mb-4">
              {deleteError}
            </div>
          )}

          <input
            type={user?.password_hash ? "password" : "text"}
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder={user?.password_hash ? "Enter your password" : "Type: delete my account"}
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={deleteMutation.isPending}
            onCopy={(e) => !user?.password_hash && e.preventDefault()}
            onCut={(e) => !user?.password_hash && e.preventDefault()}
            onPaste={(e) => !user?.password_hash && e.preventDefault()}
            autoComplete="off"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false)
                setDeletePassword('')
                setDeleteError('')
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
              disabled={deleteMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Data Report Modal */}
      <Modal
        isOpen={showDataReport && !!dataReport}
        onClose={() => setShowDataReport(false)}
        className="max-w-4xl w-full"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Your Data Report</h3>
            <button
              onClick={() => setShowDataReport(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl flex-shrink-0"
            >
              ×
            </button>
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
            {/* User Profile Section */}
            {dataReport && !!dataReport.user_profile && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaEye className="mr-2 text-bfgreen-base" />
                  User Profile
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {Object.entries(dataReport.user_profile as Record<string, unknown>).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 py-2 border-b border-gray-200 last:border-0">
                      <span className="font-medium text-gray-700 capitalize flex-shrink-0">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-gray-600 text-right break-words">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Activity Section */}
            {dataReport && !!dataReport.learning_activity && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Learning Activity</h4>
                <div className="space-y-4">
                  {/* Module Subscriptions */}
                  {!!((dataReport.learning_activity as Record<string, unknown>).module_subscriptions) && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Module Subscriptions ({Array.isArray((dataReport.learning_activity as Record<string, unknown>).module_subscriptions) ? ((dataReport.learning_activity as Record<string, unknown>).module_subscriptions as unknown[]).length : 0})
                      </h5>
                      {Array.isArray((dataReport.learning_activity as Record<string, unknown>).module_subscriptions) && ((dataReport.learning_activity as Record<string, unknown>).module_subscriptions as unknown[]).length > 0 ? (
                        <div className="space-y-2">
                          {((dataReport.learning_activity as Record<string, unknown>).module_subscriptions as Array<Record<string, unknown>>).map((sub, idx) => (
                              <div key={idx} className="text-sm text-gray-600 break-words">
                                • {String(sub.module_title || 'Unknown')} (subscribed: {String(sub.subscribed_at || 'N/A')})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No subscriptions</p>
                        )}
                      </div>
                    )}

                    {/* Course Likes */}
                    {!!((dataReport.learning_activity as Record<string, unknown>).course_likes) && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">
                          Course Likes ({Array.isArray((dataReport.learning_activity as Record<string, unknown>).course_likes) ? ((dataReport.learning_activity as Record<string, unknown>).course_likes as unknown[]).length : 0})
                        </h5>
                        {Array.isArray((dataReport.learning_activity as Record<string, unknown>).course_likes) && ((dataReport.learning_activity as Record<string, unknown>).course_likes as unknown[]).length > 0 ? (
                          <div className="space-y-2">
                            {((dataReport.learning_activity as Record<string, unknown>).course_likes as Array<Record<string, unknown>>).map((like, idx) => (
                              <div key={idx} className="text-sm text-gray-600 break-words">
                                • {String(like.course_name || 'Unknown')} (liked: {String(like.liked_at || 'N/A')})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No likes</p>
                        )}
                      </div>
                    )}

                    {/* Course Completions */}
                    {!!((dataReport.learning_activity as Record<string, unknown>).course_completions) && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">
                          Course Completions ({Array.isArray((dataReport.learning_activity as Record<string, unknown>).course_completions) ? ((dataReport.learning_activity as Record<string, unknown>).course_completions as unknown[]).length : 0})
                        </h5>
                        {Array.isArray((dataReport.learning_activity as Record<string, unknown>).course_completions) && ((dataReport.learning_activity as Record<string, unknown>).course_completions as unknown[]).length > 0 ? (
                          <div className="space-y-2">
                            {((dataReport.learning_activity as Record<string, unknown>).course_completions as Array<Record<string, unknown>>).map((completion, idx) => (
                              <div key={idx} className="text-sm text-gray-600 break-words">
                                • {String(completion.course_name || 'Unknown')} (completed: {String(completion.completed_at || 'N/A')})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No completions</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Contributions Section */}
              {dataReport && !!dataReport.user_contributions && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Your Contributions</h4>
                  <div className="space-y-4">
                    {/* Owned Modules */}
                    {!!((dataReport.user_contributions as Record<string, unknown>).owned_modules) && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">
                          Owned Modules ({Array.isArray((dataReport.user_contributions as Record<string, unknown>).owned_modules) ? ((dataReport.user_contributions as Record<string, unknown>).owned_modules as unknown[]).length : 0})
                        </h5>
                        {Array.isArray((dataReport.user_contributions as Record<string, unknown>).owned_modules) && ((dataReport.user_contributions as Record<string, unknown>).owned_modules as unknown[]).length > 0 ? (
                          <div className="space-y-2">
                            {((dataReport.user_contributions as Record<string, unknown>).owned_modules as Array<Record<string, unknown>>).map((module, idx) => (
                              <div key={idx} className="text-sm text-gray-600 break-words">
                                • {String(module.title || 'Unknown')}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No owned modules</p>
                        )}
                      </div>
                    )}

                    {/* Module Comments */}
                    {!!((dataReport.user_contributions as Record<string, unknown>).module_comments) && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">
                          Comments ({Array.isArray((dataReport.user_contributions as Record<string, unknown>).module_comments) ? ((dataReport.user_contributions as Record<string, unknown>).module_comments as unknown[]).length : 0})
                        </h5>
                        {Array.isArray((dataReport.user_contributions as Record<string, unknown>).module_comments) && ((dataReport.user_contributions as Record<string, unknown>).module_comments as unknown[]).length > 0 ? (
                          <div className="space-y-2">
                            {((dataReport.user_contributions as Record<string, unknown>).module_comments as Array<Record<string, unknown>>).map((comment, idx) => (
                              <div key={idx} className="text-sm text-gray-600 border-b border-gray-200 pb-2 last:border-0">
                                <div className="font-medium break-words">{String(comment.module_title || 'Unknown Module')}</div>
                                <div className="italic break-words">&quot;{String(comment.content)}&quot;</div>
                                <div className="text-xs text-gray-400 break-words">Created: {String(comment.created_at || 'N/A')}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No comments</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata Summary */}
              {dataReport && !!dataReport.metadata && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Summary Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(dataReport.metadata as Record<string, unknown>).map(([key, value]) => (
                      <div key={key} className="bg-bfgreen-white border-l-4 border-bfgreen-base p-3 rounded">
                        <div className="text-2xl font-bold text-bfgreen-base">{String(value)}</div>
                        <div className="text-xs text-gray-600 capitalize">{key.replace(/total_/g, '').replace(/_/g, ' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Date */}
              {dataReport && !!dataReport.export_date && (
                <div className="text-center text-sm text-gray-500 mt-6">
                  Data exported on: {new Date(String(dataReport.export_date)).toLocaleString()}
                </div>
              )}
            </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                if (!dataReport) return
                const dataStr = JSON.stringify(dataReport, null, 2)
                const dataBlob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = `brainforest-data-report-${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
              }}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <FaDownload className="inline mr-2" />
              Download as JSON
            </button>
            <button
              onClick={() => setShowDataReport(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}

export default DataPrivacyPage