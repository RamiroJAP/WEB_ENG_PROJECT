import React from 'react'
import './Login.css'

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">WOLVES FOOTWEAR</h1>
        
        <div className="login-box">
          <p className="login-label">Login as:</p>
          
          <button className="login-btn admin-btn">ADMIN</button>
          
          <p className="or-text">OR</p>
          
          <button className="login-btn user-btn">USER</button>
        </div>
      </div>
    </div>
  )
}
