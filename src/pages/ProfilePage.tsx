import React from 'react'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import { userQuery } from '../api/user/user.queries'
import { useQuery } from '@tanstack/react-query'
import { useLogout } from '../api/user/user.services'
import { FaUser, FaListUl, FaPen, FaPenNib, FaShieldAlt } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import UserSidebar from './UserSidebar'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useLogout()

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => userQuery(),
  })

  return (
    <>
      <Header />
      <UserSidebar
        title="User Menu"
        position="left"
        buttons={[
          {
            text: "My Profile",
            icon: <FaUser />,
            onClick: () => navigate("/profile"),
            isActive: location.pathname === "/profile",
          },
          {
            text: "Data and privacy",
            icon: <FaListUl />,
            onClick: () => navigate("/profile/data-privacy"),
            isActive: location.pathname === "/profile/data-privacy",
          },
          {
            text: "Appearance",
            icon: <FaPen />,
            onClick: () => navigate("/profile/appearance"),
            isActive: location.pathname === "/profile/appearance",
          },
        ]}
      />
      <div className="flex flex-col items-center h-screen bg-gray-100">
        <div className="h-8"></div>
        {/* User profile picture here */}
        <h1 className="text-4xl font-bold mb-4">
          Welcome, <span className="text-bfgreen-base">{user?.pseudo}</span>
        </h1>
        <p className="text-xl mb-12">From here you can manage your information and preferences for your BrainForest account</p>
        
        <div className="w-3/4 max-w-4xl">
          <div className="flex flex-col items-start rounded-4xl border-3 p-8 text-xl font-bold w-full mb-4">
            <h2 className="text-2xl font-bold mb-6">Your Informations</h2>
            <div className="flex flex-col items-start justify-center w-full">
              <div className="flex justify-between w-full rounded-full bg-gray-200 p-2 mb-2">
                <span>User ID:</span>
                <span>{user?.id}</span>
              </div>
              <div className="flex justify-between w-full rounded-full p-2 mb-2">
                <span>Username:</span>
                <span>{user?.pseudo}</span>
              </div>
              <div className="flex justify-between w-full rounded-full bg-gray-200 p-2 mb-2">
                <span>Role:</span>
                <span>{user?.role}</span>
              </div>
              <div className="flex justify-between w-full rounded-full p-2 mb-2">
                <span>Email address:</span>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-row items-stretch justify-between w-full gap-4">
            <div className="flex flex-col items-start rounded-4xl border-3 p-8 text-xl w-1/2">
              <div className="flex flex-row items-center justify-between w-full pr-4">
                <h2 className="text-2xl font-bold mb-6">Customization</h2>
                <FaPenNib className="text-4xl mb-4 text-bfgreen-dark" />
              </div>
              <h3 className="text-base mb-4">Make the BrainForest interface a place you love, a place that suits you for your learning</h3>
            </div>
            <div className="flex flex-col items-start rounded-4xl border-3 p-8 text-xl w-1/2">
            <div className="flex flex-row items-center justify-between w-full pr-4">
              <h2 className="text-2xl font-bold mb-6">Confidentiality</h2>
              <FaShieldAlt className="text-4xl mb-4 text-bfgreen-dark" />
            </div>
              <h3 className="text-base mb-4">Choose your privacy and security settings for your personal information</h3>
            </div>
          </div>
          
          <div className="flex justify-center w-full mt-4">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
              Logout
            </button>
          </div>
        </div>
        
        {isLoading && <div className="mt-4">Loading...</div>}
        {error && <div className="mt-4 text-red-500">Error loading user data</div>}
      </div>
      <Footer />
    </>
  )
}

export default ProfilePage
