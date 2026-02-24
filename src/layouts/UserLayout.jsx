import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import '../styles/globals.css'

export default function UserLayout({ children }) {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="user-header">
        <div className="user-brand">
          Wolves Footwear Store
        </div>
        <nav className="user-nav">
          <Link to="/user/home">Home</Link>
          <Link to="/user/shop">Shop</Link>
          <Link to="/user/about">About</Link>
          <Link to="/user/cart" className="cart-link">
            Cart <span className="cart-count">{getTotalItems()}</span>
          </Link>
          <span className="user-info">Welcome, {user?.username}!</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main className="user-container">
        {children}
      </main>
      <footer className="user-footer">© Wolves Footwear Store</footer>
    </>
  )
}
