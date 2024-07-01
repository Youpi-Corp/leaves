import React from 'react'
import InputBox from '../../components/interaction/input/InputBox'

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login">
        <h1>Login Page</h1>
        <form>
          <div>
            <label>Email</label>
            <input type="email" />
          </div>
          <div>
            <label>Password</label>
            <InputBox type="email" />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
