import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Homepage from './pages/homepage/Homepage'
import Dashboard from './pages/dashboard/Dashboard'
import CustomerHome from './pages/customer/CustomerHome'
import SellerDashboard from './pages/seller/SellerDashboard'
import Login from './pages/login/Login'
import Signup from './pages/login/Signup'

export default function App() {
  return (
    <BrowserRouter>
      <header className="topbar">
        <div className="brand">ShoeStore</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/customer">Customer</Link>
          <Link to="/seller">Seller</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/seller" element={<SellerDashboard />} />
        </Routes>
      </main>
      <footer className="footer">© ShoeStore</footer>
    </BrowserRouter>
  )
}
