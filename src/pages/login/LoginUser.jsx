import React, { useState } from 'react'
import './LoginForm.css'

export default function LoginUser() {
  const [showSignup, setShowSignup] = useState(false)
  const [message, setMessage] = useState('')
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

  const handleLogin = (e) => {
    e.preventDefault()
    if (!loginData.username || !loginData.password) {
      setMessage('Please fill in all fields')
      return
    }
    setMessage('Login successful! (Demo)')
    setLoginData({ username: '', password: '' })
  }

  const handleSignup = (e) => {
    e.preventDefault()
    setMessage('')

    // Validation
    if (!signupData.username || !signupData.email || !signupData.password) {
      setMessage('Please fill in all fields')
      return
    }

    if (signupData.password.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }

    if (!signupData.email.includes('@')) {
      setMessage('Please enter a valid email')
      return
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.email === signupData.email)) {
      setMessage('Email already exists')
      return
    }

    // Save new user
    const newUser = {
      id: Date.now(),
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
      userType: 'user'
    }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    setMessage('Account created successfully! Returning to login...')
    setTimeout(() => {
      setSignupData({ username: '', email: '', password: '' })
      setShowSignup(false)
      setMessage('')
    }, 2000)
  }

  const handleCreateAccount = () => {
    setMessage('')
    setShowSignup(true)
  }

  const handleBackToLogin = () => {
    setMessage('')
    setShowSignup(false)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {!showSignup ? (
          <div className="login-box">
            <h1 className="login-title">Login as User:</h1>
            
            {message && <div className="message-box error">{message}</div>}
            
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

            <button className="login-btn" onClick={handleLogin}>Login</button>

            <button className="create-account" onClick={handleCreateAccount}>Create Account</button>
          </div>
        ) : (
          <div className="login-box signup-box">
            <h1 className="login-title">Create Account</h1>
            
            {message && <div className={`message-box ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}
            
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
              <button className="signup-btn sign-up-btn" onClick={handleSignup}>SIGN UP</button>
              <button className="signup-btn sign-in-btn" onClick={handleBackToLogin}>SIGN IN</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
