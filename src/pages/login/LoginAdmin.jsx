import React, { useState } from 'react'
import './LoginForm.css'

export default function LoginAdmin() {
  const [showSignup, setShowSignup] = useState(false)
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    })
  }

  const handleCreateAccount = () => {
    setShowSignup(true)
  }

  const handleBackToLogin = () => {
    setShowSignup(false)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {!showSignup ? (
          <div className="login-box">
            <h1 className="login-title">Login as Admin:</h1>
            
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input 
                  type="text" 
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="form-input"
                />
              </div>
            </div>

            <a href="#" className="forgot-password">Forgot Password</a>

            <button className="login-btn">Login</button>

            <button className="create-account" onClick={handleCreateAccount}>Create Account</button>
          </div>
        ) : (
          <div className="login-box signup-box">
            <h1 className="login-title">Create Account</h1>
            
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input 
                  type="text" 
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input 
                  type="email" 
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="button-group">
              <button className="signup-btn sign-up-btn">SIGN UP</button>
              <button className="signup-btn sign-in-btn" onClick={handleBackToLogin}>SIGN IN</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
