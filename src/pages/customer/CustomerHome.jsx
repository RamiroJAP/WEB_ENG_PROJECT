import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/user/CustomerHome.css'

export default function CustomerHome() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="user-home">
      <div className="user-container">
        <section className="user-header">
          <h1 className="user-greeting">Welcome, {user?.username || 'Shopper'}</h1>
          <p className="user-tagline">Discover products and manage your shopping journey.</p>
        </section>

        <section className="quick-links">
          <article className="quick-link-card">
            <div className="quick-link-icon">🛍️</div>
            <h3 className="quick-link-title">Shop Products</h3>
            <p className="quick-link-desc">Browse shoes and add your favorites to cart.</p>
            <button className="quick-link-btn" onClick={() => navigate('/user/shop')}>
              Go to Shop
            </button>
          </article>
          <article className="quick-link-card">
            <div className="quick-link-icon">🧾</div>
            <h3 className="quick-link-title">Open Cart</h3>
            <p className="quick-link-desc">Proceed to checkout and place your next order.</p>
            <button className="quick-link-btn" onClick={() => navigate('/user/cart')}>
              Go to Cart
            </button>
          </article>
        </section>
      </div>
    </div>
  )
}
