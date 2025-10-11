import React from 'react'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import { userQuery } from '../api/user/user.queries'
import { useQuery } from '@tanstack/react-query'
import { FaShieldAlt, FaEye, FaTrash, FaDownload, FaCog } from 'react-icons/fa'
import UserLayout from '../components/layout/UserLayout'

const DataPrivacyPage: React.FC = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => userQuery(),
  })

  if (isLoading) {
    return (
      <>
        <Header />
        <UserLayout userRole={undefined} isAuthenticated={false}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-bfgreen-base border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </UserLayout>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
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
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
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
              <button className="w-full px-4 py-2 bg-bfgreen-base text-white rounded hover:bg-bfgreen-dark transition-colors">
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
                    <input type="checkbox" className="sr-only peer" defaultChecked />
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
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Request Data Export
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
              <button className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
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
              <button className="px-6 py-2 bg-bfgreen-base text-white rounded hover:bg-bfgreen-dark transition-colors">
                Contact Community Team
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors">
                View on GitHub
              </button>
            </div>
          </div>
        </div>
      </UserLayout>
      <Footer />
    </>
  )
}

export default DataPrivacyPage