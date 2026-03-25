import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/admin/LoginAdmin.css'

export default function LoginAdmin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [message, setMessage] = useState('')
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (!loginData.username || !loginData.password) {
      alert('Please fill in all fields')
      setMessage('Please fill in all fields')
      return
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(u => 
      (u.username === loginData.username || u.email === loginData.username) && 
      u.password === loginData.password &&
      u.userType === 'admin'
    )

    if (foundUser) {
      alert('Login successful! Welcome admin!')
      login({
        id: foundUser.id,
        username: foundUser.email,
        email: foundUser.email,
        userType: 'admin'
      })
      setMessage('Login successful! Redirecting...')
      setLoginData({ username: '', password: '' })
      setTimeout(() => {
        navigate('/admin')
      }, 1500)
    } else {
      alert('Invalid username or password')
      setMessage('Invalid username or password')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <img src="/web-wolves.png" alt="Wolves Footwear Logo" />
        </div>

        <div className="login-box">
          <h1 className="login-title">Login as Admin:</h1>

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
        </div>
      </div>
    </div>
  )
}
