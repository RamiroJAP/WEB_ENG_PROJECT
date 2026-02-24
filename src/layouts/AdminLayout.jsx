import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/globals.css'

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-badge">ADMIN</span>
          Wolves Footwear - Admin Panel
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/checkouts">Checkout List</Link>
          <Link to="/admin/users">Users</Link>
          <span className="admin-user-info">{user?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main className="admin-container">
        {children}
      </main>
      <footer className="admin-footer">© Wolves Footwear Store - Admin Panel</footer>
    </>
  )
}
