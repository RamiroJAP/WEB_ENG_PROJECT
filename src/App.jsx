import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import './styles/globals.css'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import Shop from './pages/shop/Shop'
import About from './pages/about/About'
import AdminDashboard from './pages/admin/AdminDashboard'
import CheckoutList from './pages/admin/CheckoutList'
import Cart from './pages/cart/Cart'
import OrderTracker from './pages/customer/OrderTracker'
import Favorites from './pages/favorites/Favorites'
import Login from './pages/login/login'
import LoginAdmin from './pages/login/LoginAdmin'
import LoginUser from './pages/login/LoginUser'

export default function App() {
  const { user } = useAuth()

  // Redirect based on user type
  if (user) {
    if (user.userType === 'admin') {
      return (
        <AdminLayout>
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/checkouts" element={<CheckoutList />} />
            <Route path="/admin/products" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        </AdminLayout>
      )
    } else if (user.userType === 'user') {
      return (
        <UserLayout>
          <Routes>
            <Route path="/user/home" element={<Shop />} />
            <Route path="/user/shop" element={<Shop />} />
            <Route path="/user/about" element={<About />} />
            <Route path="/user/orders" element={<OrderTracker />} />
            <Route path="/user/favorites" element={<Favorites />} />
            <Route path="/user/cart" element={<Cart />} />
            <Route path="/" element={<Shop />} />
            <Route path="*" element={<Shop />} />
          </Routes>
        </UserLayout>
      )
    }
  }

  // Not logged in - show login pages
  return (
    <>
      <header className="topbar">
        <div className="brand">Wolves Footwear Store</div>
        <nav>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/login/user" element={<LoginUser />} />
          <Route path="*" element={<Shop />} />
        </Routes>
      </main>
      <footer className="footer">© Wolves Footwear Store</footer>
    </>
  )
}
