import React from 'react'
import { useCheckout } from '../../context/CheckoutContext'
import '../../styles/admin/ReceiptModal.css'

export default function ReceiptModal({ checkoutId, onClose }) {
  const { getCheckoutById } = useCheckout()
  const checkout = getCheckoutById(checkoutId)

  if (!checkout) {
    return null
  }

  const currentDate = new Date(checkout.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
              <span className="receipt-value">{checkout.receiptNumber}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Customer:</span>
              <span className="receipt-value">{checkout.customer}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Email:</span>
              <span className="receipt-value">{checkout.email}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Date:</span>
              <span className="receipt-value">{currentDate}</span>
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
                {checkout.items && checkout.items.map((item) => (
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
              <span>₹{checkout.total.toFixed(2)}</span>
            </div>
            <div className="receipt-summary-row">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="receipt-summary-row receipt-total">
              <span>TOTAL AMOUNT:</span>
              <span>₹{checkout.total.toFixed(2)}</span>
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
            <p className="receipt-footer-info">Thank you for shopping with us!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
