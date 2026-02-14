import React from 'react'

export default function CustomerHome(){
  return (
    <div>
      <h1>Customer Portal</h1>
      <div className="card">
        <p>Welcome back — view orders, saved items, and account settings.</p>
        <div style={{display:'flex',gap:8}}>
          <a className="btn" href="#">My Orders</a>
          <a style={{padding:'8px 12px'}} className="btn" href="#">Wishlist</a>
        </div>
      </div>
    </div>
  )
}
