import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useCart } from './context/CartContext'
import './styles/globals.css'
import Homepage from './pages/homepage/Homepage'
import Shop from './pages/shop/Shop'
import About from './pages/about/About'
import Dashboard from './pages/dashboard/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import Login from './pages/login/Login'
import LoginAdmin from './pages/login/LoginAdmin'
import LoginUser from './pages/login/LoginUser'
import Cart from './pages/cart/Cart'

export default function App() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">Wolves Footwear Store</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/cart" className="cart-link">
            Cart <span className="cart-count">{getTotalItems()}</span>
          </Link>
          {!user && <Link to="/login">Login</Link>}
          {user && user.userType === 'admin' && (
            <Link to="/admin">Admin</Link>
          )}
          {user && (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/login/user" element={<LoginUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <footer className="footer">© Wolves Footwear Store</footer>
    </>
  )
}
