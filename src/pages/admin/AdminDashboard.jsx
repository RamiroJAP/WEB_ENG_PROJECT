import React, { useState } from 'react'
import './AdminDashboard.css'

export default function AdminDashboard(){
  const [products] = useState([
    { id: 1, name: 'Golden Runner', category: 'Men', image: '👟' },
    { id: 2, name: 'Black Max', category: 'Men', image: '👟' },
    { id: 3, name: 'Jordan Low', category: 'Men', image: '👟' },
    { id: 4, name: 'Purple Sneaker', category: 'Best Seller', image: '👟' },
    { id: 5, name: 'White Slides', category: 'Kids', image: '👟' },
    { id: 6, name: 'Beige Slides', category: 'Women', image: '👟' },
    { id: 7, name: 'Black Slides', category: 'Kids', image: '👟' },
    { id: 8, name: 'Cream Slides', category: 'Women', image: '👟' }
  ])

  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Kids', 'Men', 'Women', 'Best Seller', 'About']

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <div className="admin-page">
      <div className="admin-header">
        <input type="text" placeholder="Name of Store" className="store-name-input" />
        <button className="add-product-btn">
          <span>➕</span> Add New Product
        </button>
      </div>

      <div className="categories">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
            {cat !== 'All' && cat !== 'Best Seller' && cat !== 'About' && ' ▼'}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image}
            </div>
            <div className="product-name">{product.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

