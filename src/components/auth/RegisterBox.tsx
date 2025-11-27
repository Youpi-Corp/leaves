import React, { useMemo, useState } from 'react'
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
import zxcvbn from 'zxcvbn'

const RegisterBox: React.FC = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const registerCredentials: RegisterCredentials = {
    email,
    pseudo: username,
    password: password,
    role: '1000',
  }

  const passwordAnalysis = useMemo(() => {
    if (!password) return null
    return zxcvbn(password)
  }, [password])

  const passwordScore = passwordAnalysis?.score ?? null
  const passwordStrengthLabel = passwordScore !== null
    ? ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'][passwordScore]
    : null
  const passwordStrengthColor = passwordScore !== null
    ? ['text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-600', 'text-green-700'][passwordScore]
    : 'text-bfbase-darkgrey'
  const passwordStrengthBgColor = passwordScore !== null
    ? ['bg-red-500', 'bg-orange-500', 'bg-yellow-600', 'bg-green-600', 'bg-green-700'][passwordScore]
    : 'bg-bfbase-darkgrey'
  const passwordStrengthWidth = passwordScore !== null ? ((passwordScore + 1) / 5) * 100 : 0

  const { mutate, isPending } = useMutation({
    mutationFn: () => registerQuery(registerCredentials),
    mutationKey: ['register'],
    onSuccess: () => navigate('/login'),
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.'
      setError(message)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!password) {
      setError('Password cannot be empty.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!passwordAnalysis || passwordAnalysis.score < 2) {
      setError('Password is too weak. Try adding more unique words or symbols.')
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

        {password && (
          <div className="w-full text-sm">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${passwordStrengthColor}`}>
                Strength: {passwordStrengthLabel}
              </span>
            </div>
            <div className="mt-1 h-2 bg-gray-100 rounded-full">
              <div
                className={`h-full rounded-full ${passwordStrengthBgColor}`}
                style={{ width: `${passwordStrengthWidth}%` }}
              />
            </div>
            {passwordAnalysis?.feedback?.warning && (
              <p className="mt-1 text-bfbase-darkgrey">
                {passwordAnalysis.feedback.warning}
              </p>
            )}
            {!passwordAnalysis?.feedback?.warning &&
              (passwordAnalysis?.feedback?.suggestions?.length ?? 0) > 0 && (
              <p className="mt-1 text-bfbase-darkgrey">
                {passwordAnalysis.feedback.suggestions[0]}
              </p>
            )}
          </div>
        )}

        <InputBox
          onChange={(e) => setConfirmPassword(e.target.value)}
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
