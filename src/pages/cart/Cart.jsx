import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useCheckout } from '../../context/CheckoutContext'
import { useProducts } from '../../context/ProductsContext'
import Receipt from './Receipt'
import './Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const { addCheckout } = useCheckout()
  const { products } = useProducts()
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState(null)

  const getLivePrice = (item) => {
    const matchedProduct = products.find((product) => product.id === item.id)
    const candidatePrice = matchedProduct?.price ?? item.price
    const numericPrice = Number(candidatePrice)
    return Number.isFinite(numericPrice) ? numericPrice : 0
  }

  const cartWithLivePrices = cart.map((item) => ({
    ...item,
    price: getLivePrice(item)
  }))

  const totalPrice = cartWithLivePrices.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleCheckout = () => {
    if (cartWithLivePrices.length === 0) {
      alert('Your cart is empty!')
      return
    }

    const receiptDate = new Date()
    const receiptNumber = Math.random().toString(36).slice(2, 11).toUpperCase()
    const customerName = user?.username || 'Shopper'
    const customerEmail = user?.email || 'user@example.com'

    const newCheckout = addCheckout({
      customer: customerName,
      email: customerEmail,
      total: totalPrice,
      items: cartWithLivePrices,
      receiptNumber
    })

    setReceiptData({
      receiptNumber,
      receiptDate: receiptDate.toISOString(),
      customerName,
      customerEmail,
      status: newCheckout.status
    })
    setShowReceipt(true)
  }

  const handleReceiptClose = () => {
    setShowReceipt(false)
    setReceiptData(null)
    clearCart()
    navigate('/user/shop')
  }

  if (showReceipt) {
    return (
      <Receipt
        cart={cartWithLivePrices}
        total={totalPrice}
        onClose={handleReceiptClose}
        receiptNumber={receiptData?.receiptNumber}
        receiptDate={receiptData?.receiptDate}
        customerName={receiptData?.customerName}
        customerEmail={receiptData?.customerEmail}
        orderStatus={receiptData?.status}
      />
    )
  }

  if (cartWithLivePrices.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h1>Your Cart is Empty</h1>
          <p>Add some items to your cart and come back here!</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/user/shop')}>
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
          {cartWithLivePrices.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₱{item.price.toLocaleString()}</p>
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
                ₱{(item.price * item.quantity).toLocaleString()}
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
            <span>₱{totalPrice.toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₱{totalPrice.toLocaleString()}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <button className="continue-btn" onClick={() => navigate('/user/shop')}>
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
