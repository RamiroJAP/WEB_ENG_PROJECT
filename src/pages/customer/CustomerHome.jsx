import React from 'react'

export default function CustomerHome() {
  return (
    <div>
      <h1>Customer Portal</h1>
      <div className="card">
        <p>Welcome back — view orders, saved items, and account settings.</p>
        <div className="customer-actions">
          <a className="btn" href="#">My Orders</a>
          <a className="btn" href="#">Wishlist</a>
        </div>
      </div>
    </div>
  )
}
