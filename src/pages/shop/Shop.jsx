import React, { useState } from 'react'
import { useFavorites } from '../../context/FavoritesContext'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductsContext'
import '../../styles/user/Shop.css'

export default function Shop() {
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites()
  const { addToCart } = useCart()
  const { products } = useProducts()

  const getAudienceCategory = (audience) => {
    const normalized = (audience || '').toLowerCase()
    if (normalized === 'kids' || normalized === 'men' || normalized === 'women') {
      return normalized
    }
    return 'men'
  }

  const getProductType = (product) => {
    const normalizedType = (product.type || product.category || '').toLowerCase()
    const validTypes = ['running', 'casual', 'basketball', 'slippers', 'sandals']
    return validTypes.includes(normalizedType) ? normalizedType : 'casual'
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const audienceMatch =
      selectedAudience === 'all' || getAudienceCategory(product.audience) === selectedAudience
    const typeMatch = selectedType === 'all' || getProductType(product) === selectedType
    const priceMatch = selectedPrice === 'all' || 
      (selectedPrice === 'budget' && product.price <= 3500) ||
      (selectedPrice === 'mid' && product.price > 3500 && product.price <= 4500) ||
      (selectedPrice === 'premium' && product.price > 4500)
    return audienceMatch && typeMatch && priceMatch
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
                className={`filter-btn-small ${selectedAudience === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedAudience('all')
                  setSelectedType('all')
                }}
              >
                All Products
              </button>
              <button 
                className={`filter-btn-small ${selectedAudience === 'kids' ? 'active' : ''}`}
                onClick={() => setSelectedAudience('kids')}
              >
                Kids
              </button>
              <button 
                className={`filter-btn-small ${selectedAudience === 'men' ? 'active' : ''}`}
                onClick={() => setSelectedAudience('men')}
              >
                Men
              </button>
              <button 
                className={`filter-btn-small ${selectedAudience === 'women' ? 'active' : ''}`}
                onClick={() => setSelectedAudience('women')}
              >
                Women
              </button>
            </div>
          </div>

          {selectedAudience !== 'all' && (
            <div className="filter-group-inline">
              <h4 className="filter-label">Type:</h4>
              <div className="filter-buttons">
                <select
                  className="filter-btn-small"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="running">Running</option>
                  <option value="casual">Casual</option>
                  <option value="basketball">Basketball</option>
                  <option value="slippers">Slippers</option>
                  <option value="sandals">Sandals</option>
                </select>
              </div>
            </div>
          )}

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
                    <div className="product-overlay">
                      <button 
                        className="product-quick-add"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className={`product-favorite-btn ${isFavorited(product.id) ? 'favorited' : ''}`}
                        onClick={() => {
                          if (isFavorited(product.id)) {
                            removeFromFavorites(product.id)
                          } else {
                            addToFavorites(product)
                          }
                        }}
                        title={isFavorited(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        ♥
                      </button>
                    </div>
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
