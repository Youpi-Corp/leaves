import React from 'react'
import { FaCheck } from 'react-icons/fa'
import Button from '../interaction/button/Button'
import InputBox from '../interaction/input/InputBox'
import Link from '../interaction/link/Link'

const LoginBox: React.FC = () => {
  return (
    <div className="py-6 px-20 bg-white shadow-xl rounded-3xl flex flex-col items-center space-y-4">
      <h1 className="text-bfbase-darkgrey text-2xl font-bold">Login</h1>
      <InputBox className="w-[40rem]" placeholder="Username or e-mail" />
      <InputBox className="w-[40rem]" placeholder="Password" type="password" />
      <div className="flex flex-row w-full self-start items-center">
        <Button className="px-10 py-2" icon={<FaCheck />}>
          Validate
        </Button>
        <span className="text-bfbase-darkgrey text-sm ml-auto">
          Don&apos;t have an account yet? <Link to="#">Sign up here</Link>
        </span>
      </div>
      <div className="w-full border-t-2 border-bfbase-grey mt-4">or</div>
    </div>
  )
}

export default LoginBox
