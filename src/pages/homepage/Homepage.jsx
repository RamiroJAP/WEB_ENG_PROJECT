import React from 'react'
import '../../styles/user/Homepage.css'

export default function Homepage() {
  const products = [
    { id: 1, name: 'Classic Runner', price: '$79' },
    { id: 2, name: 'Street Sneaks', price: '$89' },
    { id: 3, name: 'Trail Blazer', price: '$99' },
    { id: 4, name: 'Comfy Walks', price: '$69' }
  ]

  return (
    <div>
      <h1>Welcome to Wolves Footwear</h1>
      <p className="card">Find your perfect pair — curated selection, fast checkout.</p>
      <h2>Featured</h2>
      <div className="grid">
        {products.map(product => (
          <div key={product.id} className="product card">
            <div className="product-image">Image</div>
            <strong>{product.name}</strong>
            <div className="product-price">{product.price}</div>
            <div className="product-action"><a className="btn" href="#">Buy</a></div>
          </div>
        ))}
      </div>
    </div>
  )
}
