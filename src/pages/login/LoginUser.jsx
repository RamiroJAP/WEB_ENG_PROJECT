import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/user/LoginUser.css'

export default function LoginUser() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showSignup, setShowSignup] = useState(false)
  const [message, setMessage] = useState('')
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  const [signupData, setSignupData] = useState({
    username: '',
    password: '',
    email: ''
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
    setMessage('')
    if (!loginData.username || !loginData.password) {
      alert('Please fill in all fields')
      setMessage('Please fill in all fields')
      return
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(u => 
      (u.username === loginData.username || u.email === loginData.username) && 
      u.password === loginData.password &&
      u.userType === 'user'
    )

    if (foundUser) {
      alert('Login successful! Welcome back!')
      login({
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        userType: 'user'
      })
      setMessage('Login successful! Redirecting...')
      setLoginData({ username: '', password: '' })
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } else {
      alert('Invalid username or password')
      setMessage('Invalid username or password')
    }
  }

  const handleSignup = (e) => {
    e.preventDefault()
    setMessage('')

    if (!signupData.username || !signupData.password || !signupData.email) {
      alert('Please fill in all fields')
      setMessage('Please fill in all fields')
      return
    }

    if (signupData.password.length < 6) {
      alert('Password must be at least 6 characters')
      setMessage('Password must be at least 6 characters')
      return
    }

    if (!signupData.email.includes('@')) {
      alert('Please enter a valid email')
      setMessage('Please enter a valid email')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.username === signupData.username)) {
      alert('Username already exists')
      setMessage('Username already exists')
      return
    }

    if (users.find(u => u.email === signupData.email)) {
      alert('Email already exists')
      setMessage('Email already exists')
      return
    }

    const newUser = {
      id: Date.now(),
      username: signupData.username,
      password: signupData.password,
      email: signupData.email,
      userType: 'user'
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    alert('Account created successfully!')
    setMessage('Account created! Logging you in...')
    setSignupData({ username: '', password: '', email: '' })
    
    setTimeout(() => {
      login({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        userType: 'user'
      })
      navigate('/')
    }, 1500)
  }

  const handleCreateAccount = () => {
    setShowSignup(true)
    setMessage('')
  }

  const handleBackToLogin = () => {
    setShowSignup(false)
    setMessage('')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <img src="/web-wolves.png" alt="Wolves Footwear Logo" />
        </div>

        {!showSignup ? (
          <div className="login-box">
            <h1 className="login-title">Login as User:</h1>
            
            {message && <div className="message">{message}</div>}
            
            <form onSubmit={handleLogin}>
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

              <button type="submit" className="login-btn">Login</button>

              <button type="button" className="create-account" onClick={handleCreateAccount}>Create Account</button>
            </form>
          </div>
        ) : (
          <div className="login-box signup-box">
            <h1 className="login-title">Create Account</h1>
            
            {message && <div className="message">{message}</div>}
            
            <form onSubmit={handleSignup}>
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

              <div className="button-group">
                <button type="submit" className="signup-btn sign-up-btn">SIGN UP</button>
                <button type="button" className="signup-btn sign-in-btn" onClick={handleBackToLogin}>SIGN IN</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
