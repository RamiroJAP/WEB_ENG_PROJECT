import React from 'react'
import { useFavorites } from '../../context/FavoritesContext'
import { useCart } from '../../context/CartContext'

export default function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites()
  const { addToCart } = useCart()

  return (
    <div>
      <h1>My Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorite products yet.</p>
      ) : (
        <div className="products-grid">
          {favorites.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₱{Number(product.price || 0).toLocaleString()}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
                <button onClick={() => removeFromFavorites(product.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
