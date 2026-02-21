import React, { useState } from 'react'
import '../../styles/user/Shop.css'

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')

  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Classic Running Sneakers',
      category: 'running',
      price: 4500,
      image: 'https://via.placeholder.com/300x300?text=Running+Shoe+1',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Casual Street Shoes',
      category: 'casual',
      price: 3500,
      image: 'https://via.placeholder.com/300x300?text=Casual+Shoe+1',
      rating: 4.2
    },
    {
      id: 3,
      name: 'Basketball Peak Shoes',
      category: 'basketball',
      price: 5500,
      image: 'https://via.placeholder.com/300x300?text=Basketball+1',
      rating: 4.8
    },
    {
      id: 4,
      name: 'Training Elite Flex',
      category: 'training',
      price: 4800,
      image: 'https://via.placeholder.com/300x300?text=Training+1',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Casual Loafers',
      category: 'casual',
      price: 2800,
      image: 'https://via.placeholder.com/300x300?text=Loafer+1',
      rating: 4.3
    },
    {
      id: 6,
      name: 'Marathon Pro',
      category: 'running',
      price: 5200,
      image: 'https://via.placeholder.com/300x300?text=Marathon+1',
      rating: 4.7
    },
    {
      id: 7,
      name: 'Formal Oxford',
      category: 'formal',
      price: 3800,
      image: 'https://via.placeholder.com/300x300?text=Formal+1',
      rating: 4.4
    },
    {
      id: 8,
      name: 'Sports Court Shoes',
      category: 'basketball',
      price: 5000,
      image: 'https://via.placeholder.com/300x300?text=Court+1',
      rating: 4.5
    },
    {
      id: 9,
      name: 'Training Force Plus',
      category: 'training',
      price: 4200,
      image: 'https://via.placeholder.com/300x300?text=Training+2',
      rating: 4.4
    },
    {
      id: 10,
      name: 'Urban Sneaker Style',
      category: 'casual',
      price: 3200,
      image: 'https://via.placeholder.com/300x300?text=Urban+1',
      rating: 4.1
    },
    {
      id: 11,
      name: 'Running Sprint Max',
      category: 'running',
      price: 4900,
      image: 'https://via.placeholder.com/300x300?text=Sprint+1',
      rating: 4.6
    },
    {
      id: 12,
      name: 'Wellness Walk Pro',
      category: 'casual',
      price: 2500,
      image: 'https://via.placeholder.com/300x300?text=Walk+1',
      rating: 4.0
    }
  ]

  // Filter products
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
    const priceMatch = selectedPrice === 'all' || 
      (selectedPrice === 'budget' && product.price <= 3500) ||
      (selectedPrice === 'mid' && product.price > 3500 && product.price <= 4500) ||
      (selectedPrice === 'premium' && product.price > 4500)
    return categoryMatch && priceMatch
  })

  return (
    <div className="shop-page">
      <section className="shop-hero">
        <h1 className="shop-title">SHOP WOLVES FOOTWEAR</h1>
        <p className="shop-subtitle">Discover Our Latest Collection of Premium Shoes</p>
      </section>

      <div className="shop-container">
        <div className="shop-filters-top">
          <div className="filter-group-inline">
            <h4 className="filter-label">Category:</h4>
            <div className="filter-buttons">
              <button 
                className={`filter-btn-small ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Products
              </button>
              <button 
                className={`filter-btn-small ${selectedCategory === 'running' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('running')}
              >
                Running
              </button>
              <button 
                className={`filter-btn-small ${selectedCategory === 'casual' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('casual')}
              >
                Casual
              </button>
              <button 
                className={`filter-btn-small ${selectedCategory === 'basketball' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('basketball')}
              >
                Basketball
              </button>
              <button 
                className={`filter-btn-small ${selectedCategory === 'training' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('training')}
              >
                Training
              </button>
              <button 
                className={`filter-btn-small ${selectedCategory === 'formal' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('formal')}
              >
                Formal
              </button>
            </div>
          </div>

          <div className="filter-group-inline">
            <h4 className="filter-label">Price:</h4>
            <div className="filter-buttons">
              <button 
                className={`filter-btn-small ${selectedPrice === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedPrice('all')}
              >
                All Prices
              </button>
              <button 
                className={`filter-btn-small ${selectedPrice === 'budget' ? 'active' : ''}`}
                onClick={() => setSelectedPrice('budget')}
              >
                Up to ₱3,500
              </button>
              <button 
                className={`filter-btn-small ${selectedPrice === 'mid' ? 'active' : ''}`}
                onClick={() => setSelectedPrice('mid')}
              >
                ₱3,500 - ₱4,500
              </button>
              <button 
                className={`filter-btn-small ${selectedPrice === 'premium' ? 'active' : ''}`}
                onClick={() => setSelectedPrice('premium')}
              >
                Above ₱4,500
              </button>
            </div>
          </div>
        </div>

        <main className="shop-products">
          <div className="products-header">
            <p className="product-count">Showing {filteredProducts.length} products</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <button className="product-quick-add">Quick Add</button>
                  </div>
                  <div className="product-info">
                    <p className="product-category">{product.category.toUpperCase()}</p>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      {'★'.repeat(Math.floor(product.rating))} 
                      <span className="rating-score">({product.rating})</span>
                    </div>
                    <p className="product-price">₱{product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
