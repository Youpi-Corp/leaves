import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import Spinner from '../../components/feedback/Spinner'
import AlertBox from '../../components/layout/AlertBox'
import { API_CONFIG, getApiUrl } from '../../api/config/api.config'

const GitHubCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasProcessed.current) return

    const handleCallback = async () => {
      hasProcessed.current = true
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        setError('GitHub authentication was denied or failed')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      if (!code) {
        setError('Missing authorization code')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      try {
        const response = await fetch(
          `${getApiUrl(API_CONFIG.ENDPOINTS.AUTH.GITHUB_CALLBACK)}?code=${code}`,
          {
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error('Authentication failed')
        }

        const data = await response.json()

        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ['user'] })
          navigate('/')
        } else {
          setError(data.message || 'Authentication failed')
          setTimeout(() => navigate('/login'), 3000)
        }
      } catch (err) {
        console.error('GitHub callback error:', err)
        setError('Failed to authenticate with GitHub')
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    handleCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-bfgreen-white to-transparent">
      <div className="py-10 px-20 bg-white shadow-2xl rounded-3xl flex flex-col items-center space-y-4">
        {error ? (
          <>
            <AlertBox type="error" title="Authentication Error">
              {error}
            </AlertBox>
            <p className="text-bfbase-darkgrey">
              Redirecting to login page...
            </p>
          </>
        ) : (
          <>
            <Spinner size="lg" />
            <h2 className="text-2xl text-bfbase-darkgrey font-bold">
              Authenticating with GitHub...
            </h2>
            <p className="text-bfbase-darkgrey">Please wait</p>
          </>
        )}
      </div>
    </div>
  )
}

export default GitHubCallbackPage
