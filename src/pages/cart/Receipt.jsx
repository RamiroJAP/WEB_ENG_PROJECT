import React from 'react'

export default function Receipt({ cart, total, onClose }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const receiptNumber = Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="receipt-modal-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
        <button className="receipt-close-btn" onClick={onClose}>✕</button>
        
        <div className="receipt-content">
          {/* Header */}
          <div className="receipt-header-section">
            <h1 className="receipt-store-name">🐺 Wolves Footwear Store</h1>
            <p className="receipt-tagline">Premium Footwear Since 2020</p>
            <p className="receipt-type">OFFICIAL PURCHASE RECEIPT</p>
          </div>

          {/* Receipt Info */}
          <div className="receipt-info-section">
            <div className="receipt-info-row">
              <span className="receipt-label">Receipt #:</span>
              <span className="receipt-value">{receiptNumber}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Date:</span>
              <span className="receipt-value">{currentDate}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Time:</span>
              <span className="receipt-value">{currentTime}</span>
            </div>
          </div>

          <hr className="receipt-divider" />

          {/* Items Table */}
          <div className="receipt-items-section">
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="receipt-td-center">QTY</th>
                  <th className="receipt-td-right">Price</th>
                  <th className="receipt-td-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="receipt-product-name">{item.name}</td>
                    <td className="receipt-td-center">{item.quantity}</td>
                    <td className="receipt-td-right">₹{item.price}</td>
                    <td className="receipt-td-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr className="receipt-divider" />

          {/* Summary */}
          <div className="receipt-summary-section">
            <div className="receipt-summary-row">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="receipt-summary-row">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="receipt-summary-row receipt-total">
              <span>TOTAL AMOUNT:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Message */}
          <div className="receipt-footer-message">
            <p className="receipt-footer-title">✓ Thank You for Your Purchase!</p>
            <p className="receipt-footer-text">Your order will be processed and shipped within 2-3 business days.</p>
            <p className="receipt-footer-text">Tracking information will be sent to your email.</p>
          </div>

          {/* Footer Info */}
          <div className="receipt-footer-section">
            <p className="receipt-footer-info">Wolves Footwear Store</p>
            <p className="receipt-footer-info">support@wolvesfoot.com</p>
            <p className="receipt-footer-info">© 2026 All Rights Reserved</p>
          </div>

          {/* Close Button */}
          <button className="receipt-action-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
