import React, { useState } from 'react'
import { FaCheck, FaGithub, FaGoogle } from 'react-icons/fa'
import Button from '../../components/interaction/button/Button'
import InputBox from '../../components/interaction/input/InputBox'
import LinkInternal from '../interaction/link/LinkInternal'
import Separator from '../../components/layout/Separator'
import { LoginCredentials } from '../../api/types/auth.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Spinner from '../feedback/Spinner'
import AlertBox from '../layout/AlertBox'
import { loginQuery } from '../../api/auth/auth.queries'
import { useNavigate } from 'react-router-dom'

const LoginBox: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginCredentials: LoginCredentials = { email, password }
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate, isError, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: () => loginQuery(loginCredentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/')
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate()
  }

  return (
    <div className="py-10 px-20 bg-white shadow-2xl rounded-3xl flex flex-col items-center space-y-4">
      <h1 className="mb-4 text-bfbase-darkgrey text-2xl font-bold">Login</h1>

      {isError && (
        <AlertBox type="error" title="Login failed" className="w-full">
          Invalid credentials. Please try again.
        </AlertBox>
      )}

      <form
        className="flex flex-col items-center space-y-4"
        onSubmit={handleSubmit}
      >
        <InputBox
          onChange={(e) => setEmail(e.target.value)}
          className="w-[40rem]"
          placeholder="Username or e-mail"
          type="email"
        />

        <InputBox
          onChange={(e) => setPassword(e.target.value)}
          className="w-[40rem]"
          placeholder="Password"
          type="password"
        />

        <div className="flex flex-row w-full self-start items-center">
          {isPending ? (
            <Button disabled={true} className="h-10 w-44">
              <Spinner size="md" className="border-t-white" />
            </Button>
          ) : (
            <Button type="submit" className="h-10 w-44" icon={<FaCheck />}>
              Validate
            </Button>
          )}

          <div className="flex flex-col space-y-2 ml-auto items-end text-sm">
            <LinkInternal to="/forgot-password">Forgot password?</LinkInternal>
            <span>
              Don&apos;t have an account yet?{' '}
              <LinkInternal to="/register">Sign up here</LinkInternal>
            </span>
          </div>
        </div>
      </form>

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
