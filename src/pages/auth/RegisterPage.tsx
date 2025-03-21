import React from 'react'
import Header from '../../layout/header/Header'
import Footer from '../../layout/footer/Footer'
import BubbleLg from '../../assets/bubble-1.svg'
import BubbleSm from '../../assets/bubble-2.svg'
import RegisterBox from '../../components/auth/RegisterBox'

const RegisterPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-linear-to-b from-bfgreen-white to-transparent">
        <div className="grow flex-col flex items-center justify-center">
          <h1 className="text-6xl text-bfgreen-darker font-bold mb-10">
            Let&apos;s learn
          </h1>
          <div className="relative">
            <img
              src={BubbleLg}
              className="w-52 h-52 absolute -right-20 -top-20"
            />
            <img
              src={BubbleSm}
              className="w-40 h-40 absolute -left-16 -bottom-12"
            />
            <div className="relative">
              <RegisterBox />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default RegisterPage
