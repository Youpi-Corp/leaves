import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import LoginBox from '../components/auth/LoginBox'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const queryClient = new QueryClient()
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
)

describe('LoginBox', () => {
  it('renders login form', () => {
    render(<LoginBox />, { wrapper: TestWrapper })

    expect(screen.getByText('Login'))
    expect(screen.getByPlaceholderText('E-mail'))
    expect(screen.getByPlaceholderText('Password'))
    expect(screen.getByText('Validate'))
  })

  it('handles input changes', () => {
    render(<LoginBox />, { wrapper: TestWrapper })

    const emailInput = screen.getByPlaceholderText('E-mail')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(screen.getByText('Validate'))
  })
})
