import React from 'react'
import { FaCheck, FaGithub, FaGoogle } from 'react-icons/fa'
import Button from '../../components/interaction/button/Button'
import InputBox from '../../components/interaction/input/InputBox'
import Link from '../../components/interaction/link/Link'
import Separator from '../../components/layout/Separator'

const LoginBox: React.FC = () => {
  return (
    <div className="py-10 px-20 bg-white shadow-2xl rounded-3xl flex flex-col items-center space-y-4">
      <h1 className="mb-6 text-bfbase-darkgrey text-2xl font-bold">Login</h1>
      <InputBox className="w-[40rem]" placeholder="Username or e-mail" />
      <InputBox className="w-[40rem]" placeholder="Password" type="password" />
      <div className="flex flex-row w-full self-start items-center">
        <Button className="px-10 py-2" icon={<FaCheck />}>
          Validate
        </Button>
        <div className="flex flex-col space-y-2 ml-auto items-end text-sm">
          <Link to="#">Forgot password?</Link>
          <span>
            Don&apos;t have an account yet? <Link to="#">Sign up here</Link>
          </span>
        </div>
      </div>
      <Separator>or</Separator>
      <div className="flex flex-row justify-between w-full">
        <Button accent="tertiary" icon={<FaGoogle />} className="px-14 py-2">
          Sign in with Google
        </Button>
        <Button accent="tertiary" icon={<FaGithub />} className="px-14 py-2">
          Sign in with Github
        </Button>
      </div>
    </div>
  )
}

export default LoginBox
