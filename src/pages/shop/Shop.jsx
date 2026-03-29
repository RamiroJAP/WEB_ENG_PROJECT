import React, { useEffect, useState } from 'react'
import { useFavorites } from '../../context/FavoritesContext'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductsContext'
import '../../styles/user/Shop.css'

const REVIEW_STORAGE_KEY = 'wolvesProductReviews'

export default function Shop() {
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [activeProduct, setActiveProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewsByProduct, setReviewsByProduct] = useState(() => {
    const saved = localStorage.getItem(REVIEW_STORAGE_KEY)
    if (!saved) return {}

    try {
      const parsed = JSON.parse(saved)
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
      return {}
    }
  })
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites()
  const { addToCart } = useCart()
  const { products, isConnected, refreshProducts, isLoading } = useProducts()

  useEffect(() => {
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviewsByProduct))
  }, [reviewsByProduct])

  const getProductReviews = (productId) => reviewsByProduct[productId] || []

  const getAverageRating = (productId, fallbackRating = 4) => {
    const reviews = getProductReviews(productId)
    if (reviews.length === 0) return fallbackRating
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return Number((total / reviews.length).toFixed(1))
  }

  const getProductSizes = (product) => {
    const raw = product?.size

    if (Array.isArray(raw)) {
      const cleaned = raw.map((size) => String(size).trim()).filter(Boolean)
      return cleaned.length > 0 ? cleaned : ['39', '40', '41', '42', '43']
    }

    if (typeof raw === 'number') {
      return [String(raw)]
    }

    if (typeof raw === 'string') {
      const cleaned = raw
        .split(/[\s,\\/|;-]+/)
        .map((size) => size.trim())
        .filter(Boolean)

      return cleaned.length > 0 ? cleaned : ['39', '40', '41', '42', '43']
    }

    return ['39', '40', '41', '42', '43']
  }

  const openProductDetails = (product) => {
    const productSizes = getProductSizes(product)
    setActiveProduct(product)
    setSelectedSize(productSizes[0])
    setReviewRating(5)
    setReviewComment('')
  }

  const closeProductDetails = () => {
    setActiveProduct(null)
  }

  const handleSubmitReview = () => {
    if (!activeProduct) return

    const trimmedComment = reviewComment.trim()
    if (!trimmedComment) {
      alert('Please write a comment review before submitting.')
      return
    }

    const newReview = {
      id: Date.now(),
      rating: reviewRating,
      comment: trimmedComment
    }

    setReviewsByProduct(prev => {
      const current = prev[activeProduct.id] || []
      return {
        ...prev,
        [activeProduct.id]: [newReview, ...current]
      }
    })

    setReviewRating(5)
    setReviewComment('')
  }

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

  const getProductColorLabel = (color) => {
    if (!color || typeof color !== 'string') return 'N/A'

    const normalized = color.trim()
    const colorNameByHex = {
      '#FF0000': 'Red',
      '#FFFFFF': 'White',
      '#9B59B6': 'Purple',
      '#000000': 'Black',
      '#8B4513': 'Brown',
      '#FFD700': 'Yellow',
      '#007BFF': 'Blue',
      '#28A745': 'Green',
      '#FF69B4': 'Pink',
      '#8A2BE2': 'Violet'
    }

    const upperHex = normalized.toUpperCase()
    if (colorNameByHex[upperHex]) {
      return colorNameByHex[upperHex]
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const audienceMatch =
      selectedAudience === 'all' || getAudienceCategory(product.audience) === selectedAudience
    const typeMatch = selectedType === 'all' || getProductType(product) === selectedType
    const numericPrice = Number(product.price || 0)
    const priceMatch = selectedPrice === 'all' || 
      (selectedPrice === 'budget' && numericPrice <= 140) ||
      (selectedPrice === 'mid' && numericPrice >= 250 && numericPrice <= 400) ||
      (selectedPrice === 'premium' && numericPrice > 800)
    return audienceMatch && typeMatch && priceMatch
  })

  return (
    <div className="shop-page">
      <section className="shop-hero">
        <h1 className="shop-title"> tootaa FOOTWEAR</h1>
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
                Up to ₱140
              </button>
              <button 
                className={`filter-btn-small ${selectedPrice === 'mid' ? 'active' : ''}`}
                onClick={() => setSelectedPrice('mid')}
              >
                ₱250 - ₱400
              </button>
              <button 
                className={`filter-btn-small ${selectedPrice === 'premium' ? 'active' : ''}`}
                onClick={() => setSelectedPrice('premium')}
              >
                Above ₱800
              </button>
            </div>
          </div>
        </div>

        <main className="shop-products">
          <div className="products-header">
            <div className="products-header-top">
              <p className="product-count">Showing {filteredProducts.length} products</p>
              <div className="connection-status">
                <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
                <span className="status-text">
                  {isConnected ? '✓ Synced' : '✗ Offline'}
                </span>
                <button 
                  className="refresh-btn" 
                  onClick={refreshProducts}
                  disabled={isLoading}
                  title="Refresh products"
                >
                  🔄
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div
                    className="product-image-container"
                    onClick={() => openProductDetails(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        openProductDetails(product)
                      }
                    }}
                    title="View product details"
                  >
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="product-overlay">
                      <button 
                        className="product-quick-add"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className={`product-favorite-btn ${isFavorited(product.id) ? 'favorited' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
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
                    <p className="product-category">{(product.category || 'general').toUpperCase()}</p>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      {'★'.repeat(Math.floor(getAverageRating(product.id, product.rating || 4)))}
                      <span className="rating-score">({getAverageRating(product.id, product.rating || 4)})</span>
                    </div>
                    <p className="product-price">₱{Number(product.price || 0).toLocaleString()}</p>
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

      {activeProduct && (
        <div className="product-modal-overlay" onClick={closeProductDetails}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const activeReviews = getProductReviews(activeProduct.id)
              const activeAverageRating = getAverageRating(activeProduct.id, activeProduct.rating || 4)
              const activeSizes = getProductSizes(activeProduct)
              return (
                <>
                  <button className="product-modal-close" onClick={closeProductDetails}>×</button>
                  <div className="product-modal-grid">
                    <div className="product-modal-image-wrap">
                      <img
                        src={activeProduct.image}
                        alt={activeProduct.name}
                        className="product-modal-image"
                      />

                      <div className="product-review-panel">
                        <div className="product-review-header">
                          <p className="product-review-title">Reviews ({activeReviews.length})</p>
                          <p className="product-review-average">{'★'.repeat(Math.floor(activeAverageRating))} ({activeAverageRating})</p>
                        </div>

                        <div className="product-review-form">
                          <p className="product-review-label">Write a review:</p>
                          <div className="product-review-stars">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                className={`review-star-btn ${reviewRating >= star ? 'active' : ''}`}
                                onClick={() => setReviewRating(star)}
                                title={`${star} star${star > 1 ? 's' : ''}`}
                              >
                          ★
                              </button>
                            ))}
                          </div>
                          <textarea
                            className="product-review-textarea"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Write your comment review..."
                          />
                          <button className="product-review-submit" onClick={handleSubmitReview}>
                      Submit Review
                          </button>
                        </div>

                        <div className="product-review-list">
                          {activeReviews.length === 0 ? (
                            <p className="product-review-empty">No reviews yet.</p>
                          ) : (
                            activeReviews.slice(0, 5).map(review => (
                              <div key={review.id} className="product-review-item">
                                <p className="product-review-item-stars">{'★'.repeat(review.rating)}</p>
                                <p className="product-review-item-comment">{review.comment}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="product-modal-info">
                      <h2>{activeProduct.name}</h2>
                      <p className="product-modal-price">Price: ₱{Number(activeProduct.price || 0).toLocaleString()}</p>

                      <p className="product-modal-label color-label">color</p>
                      <div className="product-modal-color-display">
                        <span
                          className="modal-color-dot-preview"
                          style={{ backgroundColor: activeProduct.color || '#cfcfcf' }}
                        />
                        <span className="product-modal-color-text">{getProductColorLabel(activeProduct.color)}</span>
                      </div>

                      <p className="product-modal-label size-label">size</p>
                      <div className="product-modal-sizes">
                        {activeSizes.map(size => (
                          <button
                            key={size}
                            className={`modal-size-btn ${selectedSize === size ? 'active' : ''}`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      <button
                        className="product-modal-action"
                        onClick={() => addToCart({ ...activeProduct, selectedSize: selectedSize || activeSizes[0] || '' })}
                      >
                  Add to Cart
                      </button>
                      <button
                        className="product-modal-action secondary"
                        onClick={() => {
                          if (isFavorited(activeProduct.id)) {
                            removeFromFavorites(activeProduct.id)
                          } else {
                            addToFavorites(activeProduct)
                          }
                        }}
                      >
                  Add to Favorites
                      </button>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
