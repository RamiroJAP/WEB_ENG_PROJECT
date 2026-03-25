import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase'
import '../../styles/user/ForgotPasswordUser.css'

export default function ForgotPasswordUser() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: ''
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    const email = formData.email.trim()

    if (!email) {
      setMessageType('error')
      setMessage('Please enter your email address')
      return
    }

    if (!email.includes('@')) {
      setMessageType('error')
      setMessage('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setMessageType('success')
      setMessage('Password reset email sent! Check your inbox and follow the link to reset your password.')
      setFormData({ email: '' })
      setTimeout(() => {
        navigate('/login/user')
      }, 2000)
    } catch (error) {
      setIsSubmitting(false)
      setMessageType('error')
      if (error.code === 'auth/user-not-found') {
        setMessage('No account found with this email')
      } else if (error.code === 'auth/invalid-email') {
        setMessage('Invalid email address')
      } else if (error.code === 'auth/too-many-requests') {
        setMessage('Too many reset requests. Please try again later.')
      } else {
        setMessage('Error sending reset email. Please try again.')
      }
    }
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="logo-container">
          <img src="/web-wolves.png" alt="Wolves Footwear Logo" />
        </div>

        <div className="forgot-password-box">
          <h1 className="forgot-password-title">Reset Password</h1>
          <p className="forgot-password-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {message && (
            <div className={`reset-message ${messageType === 'success' ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button className="login-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING...' : 'SEND RESET EMAIL'}
            </button>

            <button
              className="create-account"
              type="button"
              onClick={() => navigate('/login/user')}
              disabled={isSubmitting}
            >
              BACK TO LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
