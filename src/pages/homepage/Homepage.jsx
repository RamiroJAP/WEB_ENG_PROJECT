import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/user/Homepage.css'

export default function Homepage() {
  const navigate = useNavigate()

  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Runner Pro',
      category: 'Running',
      price: '$129',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Street Classic',
      category: 'Casual',
      price: '$99',
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Trail Master X',
      category: 'Trail',
      price: '$139',
      image: 'https://images.unsplash.com/photo-1556821552-5f629f9c1e41?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'Urban Walker',
      category: 'Lifestyle',
      price: '$89',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'Elite Performance',
      category: 'Sports',
      price: '$149',
      image: 'https://images.unsplash.com/photo-1552346154-21987786c003?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'Comfort Zone Plus',
      category: 'Comfort',
      price: '$109',
      image: 'https://images.unsplash.com/photo-1465056836283-f7dc58c8f2d4?w=400&h=400&fit=crop'
    }
  ]

  const collections = [
    { id: 1, name: 'Air Max', tag: 'New Collection' },
    { id: 2, name: 'Basketball', tag: 'Performance' },
    { id: 3, name: 'Casual', tag: 'Lifestyle' }
  ]

  return (
    <div className="homepage">
      <div className="homepage-container">
        {/* Hero Section 1 */}
        <section className="hero-section">
          <h1 className="hero-title">WOLVES FOOTWEAR</h1>
          <p className="hero-subtitle">Step Into Excellence. Unleash Your Style.</p>
          <button className="hero-cta" onClick={() => navigate('/shop')}>
            Shop Now
          </button>
        </section>

        {/* Featured Products Section */}
        <section className="featured-section">
          <h2 className="section-title">Featured Releases</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="product-content">
                  <p className="product-category">{product.category}</p>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Collections Section */}
        <section className="categories-section">
          <h2 className="section-title">Shop by Collection</h2>
          <div className="categories-grid">
            {collections.map(collection => (
              <div key={collection.id} className="category-card">
                <h3>{collection.name}</h3>
                <p>{collection.tag}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Second Hero Section */}
        <section className="hero-section hero-secondary">
          <h2 className="hero-title">Latest Collection</h2>
          <p className="hero-subtitle">Premium shoes designed for comfort and performance</p>
          <button className="hero-cta" onClick={() => navigate('/shop')}>
            Explore Collection
          </button>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <h2>Join the Wolves Pack</h2>
          <p>Stay updated on exclusive releases, special offers, and style tips</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </section>
      </div>
    </div>
  )
}
