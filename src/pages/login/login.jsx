import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/Login.css'

export default function Login() {
  const navigate = useNavigate()

  const handleAdminLogin = () => {
    navigate('/login/admin')
  }

  const handleUserLogin = () => {
    navigate('/login/user')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <img src="/web-wolves.png" alt="Wolves Footwear Logo" />
        </div>
        
        <h1 className="login-title">WOLVES FOOTWEAR</h1>
        
        <div className="login-box">
          <p className="login-label">Login as:</p>
          
          <button className="login-btn admin-btn" onClick={handleAdminLogin}>ADMIN</button>
          
          <p className="or-text">OR</p>
          
          <button className="login-btn user-btn" onClick={handleUserLogin}>USER</button>
        </div>
      </div>
    </div>
  )
}
