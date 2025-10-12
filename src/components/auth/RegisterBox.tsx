import React, { useState } from 'react'
import InputBox from '../interaction/input/InputBox'
import Button from '../interaction/button/Button'
import { FaCheck, FaGithub } from 'react-icons/fa'
import LinkInternal from '../interaction/link/LinkInternal'
import Separator from '../layout/Separator'
import { useMutation } from '@tanstack/react-query'
import { registerQuery } from '../../api/auth/auth.queries'
import { RegisterCredentials } from '../../api/types/auth.types'
import Spinner from '../feedback/Spinner'
import { useNavigate } from 'react-router-dom'
import { API_CONFIG, getApiUrl } from '../../api/config/api.config'

const RegisterBox: React.FC = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const registerCredentials: RegisterCredentials = {
    email,
    pseudo: username,
    password: password,
    role: '1000',
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => registerQuery(registerCredentials),
    mutationKey: ['register'],
    onSuccess: () => navigate('/login'),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!password) {
      setError('Password cannot be empty.')
      return
    }
    setError(null)
    mutate()
  }

  const handleGitHubLogin = async () => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.GITHUB), {
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success && data.data.url) {
        window.location.href = data.data.url
      }
    } catch (error) {
      console.error('Failed to initiate GitHub OAuth:', error)
    }
  }

  return (
    <div className="py-10 px-20 bg-white shadow-2xl rounded-3xl flex flex-col items-center space-y-4">
      <h1 className="mb-4 text-bfbase-darkgrey text-2xl font-bold">Register</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4"
      >
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
        <InputBox
          onChange={(e) => setEmail(e.target.value)}
          className="w-[40rem]"
          placeholder="E-mail"
          type="email"
        />

        <InputBox
          onChange={(e) => setUsername(e.target.value)}
          className="w-[40rem]"
          placeholder="Username"
          type="text"
        />

        <InputBox
          onChange={(e) => setPassword(e.target.value)}
          className="w-[40rem]"
          placeholder="Password"
          type="password"
        />

        <InputBox
          className="w-[40rem]"
          placeholder="Confirm password"
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
            <span>
              Already have an account?{' '}
              <LinkInternal to="/login">Sign in here</LinkInternal>
            </span>
          </div>
        </div>
      </form>

      <Separator>or</Separator>

      <Button
        accent="tertiary"
        icon={<FaGithub />}
        className="px-14 py-2 w-full"
        onClick={handleGitHubLogin}
      >
        Sign up with Github
      </Button>
    </div>
  )
}

export default RegisterBox
