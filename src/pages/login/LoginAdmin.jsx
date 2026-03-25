import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/admin/LoginAdmin.css'

export default function LoginAdmin() {
  const navigate = useNavigate()
  const { loginWithEmail } = useAuth()
  const [message, setMessage] = useState('')
  const [loginData, setLoginData] = useState({
    email: '',
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
    if (!loginData.email || !loginData.password) {
      alert('Please fill in all fields')
      setMessage('Please fill in all fields')
      return
    }

    loginWithEmail(loginData.email, loginData.password, 'admin')
      .then(() => {
        alert('Login successful! Welcome admin!')
        setMessage('Login successful! Redirecting...')
        setLoginData({ email: '', password: '' })
        setTimeout(() => {
          navigate('/admin')
        }, 1200)
      })
      .catch((error) => {
        alert('Invalid admin credentials')
        setMessage(error.message || 'Invalid admin credentials')
      })
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
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                name="email"
                value={loginData.email}
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
