import React, { useState } from 'react'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import { userQuery } from '../../api/user/user.queries'
import { useQuery } from '@tanstack/react-query'
import { mockUserData } from '../../api/mockup/mockData'
import { useUpdateUser } from '../../api/user/user.services'
import { FaSave } from 'react-icons/fa'

const EditProfilePage: React.FC = () => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => userQuery(),
  })
  
  // const [username, setUsername] = useState(mockUserData.pseudo)
  const [username, setUsername] = useState(user?.pseudo || '')
  const { updateUser } = useUpdateUser()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Updating user with username:', username)
    updateUser({
      ...user,
      pseudo: username
    })
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center bg-gray-100 pb-16">
        <div className="h-8"></div>
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-4">
          <img
            src={mockUserData.profilePicture}
            alt="Profile"
            className="w-full h-full rounded-full"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Edit your profile
        </h1>
        <p className="text-xl mb-12">From here you can manage your information and preferences for your BrainForest account</p>

        {error && <div className="text-red-500">Error loading user data</div>}
        {isLoading && <div>Loading...</div>}

        <form onSubmit={handleSubmit} className='w-3/4 max-w-4xl'>
          <div className='flex flex-col items-start rounded-4xl border-3 p-8 text-xl font-bold mb-4'>
            <h2 className="text-2xl font-bold mb-6">Your Informations</h2>
            <div className="flex flex-col items-start justify-center w-full">
              <div className="flex justify-between w-full rounded-full bg-gray-200 p-2 mb-2">
                <span>Username:</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent text-right focus:outline-none font-normal"
                />
              </div>
            </div>

            <div className="mt-4 self-end">
              <button
                type="submit"
                className="bg-bfgreen-base text-white font-bold hover:bg-bfgreen-dark text-base cursor-pointer rounded-full px-4 py-2 flex items-center"
              >
                Save changes
                <FaSave className="ml-2" />
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default EditProfilePage