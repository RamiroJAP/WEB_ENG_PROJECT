import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Receipt from './Receipt'
import './Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [showReceipt, setShowReceipt] = useState(false)

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }
    setShowReceipt(true)
  }

  const handleReceiptClose = () => {
    setShowReceipt(false)
    clearCart()
    navigate('/')
  }

  if (showReceipt) {
    return <Receipt cart={cart} total={getTotalPrice()} onClose={handleReceiptClose} />
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h1>Your Cart is Empty</h1>
          <p>Add some items to your cart and come back here!</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₹{item.price}</p>
              </div>
              <div className="item-quantity">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="item-subtotal">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{getTotalPrice().toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <button className="continue-btn" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}
