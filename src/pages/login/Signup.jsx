import React, { useState } from 'react'
import './Signup.css'

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-box">
          <h1 className="signup-title">Create Account</h1>
          
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input 
                type="text" 
                name="username"
                placeholder=""
                value={formData.username}
                onChange={handleChange}
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
                placeholder=""
                value={formData.email}
                onChange={handleChange}
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
                placeholder=""
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="button-group">
            <button className="signup-btn sign-up-btn">SIGN UP</button>
            <button className="signup-btn sign-in-btn">SIGN IN</button>
          </div>
        </div>
      </div>
    </div>
  )
}
