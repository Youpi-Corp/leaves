import React from 'react'
import LoginBox from '../../components/auth/LoginBox'
import Header from '../../layout/header/Header'

const LoginPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-bfgreen-white to-white">
        <Header />
        <div className="flex-grow flex-col flex items-center justify-center">
          <h1 className="text-6xl text-bfgreen-darker font-bold mb-10">
            Let&apos;s learn
          </h1>
          <LoginBox />
        </div>
      </div>
    </>
  )
}

export default LoginPage
