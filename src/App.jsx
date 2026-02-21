import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Homepage from './pages/homepage/Homepage'
import Shop from './pages/shop/Shop'
import About from './pages/about/About'
import Dashboard from './pages/dashboard/Dashboard'
import CustomerHome from './pages/customer/CustomerHome'
import AdminDashboard from './pages/admin/AdminDashboard'
import Login from './pages/login/Login'
import LoginAdmin from './pages/login/LoginAdmin'
import LoginUser from './pages/login/LoginUser'

export default function App() {
  const { user, logout } = useAuth()
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
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <footer className="footer">© Wolves Footwear Store</footer>
    </>
  )
}
