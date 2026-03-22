import React from 'react'

export default function Receipt({
  cart,
  total,
  onClose,
  receiptNumber,
  receiptDate,
  customerName,
  customerEmail,
  orderStatus
}) {
  const resolvedDate = receiptDate ? new Date(receiptDate) : new Date()
  const resolvedReceiptNumber = receiptNumber || Math.random().toString(36).slice(2, 11).toUpperCase()
  const resolvedCustomerName = customerName || 'Shopper'
  const resolvedCustomerEmail = customerEmail || 'user@example.com'
  const resolvedOrderStatus = (orderStatus || 'Pending').toLowerCase()

  const currentDate = resolvedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const currentTime = resolvedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const handleDownloadReceipt = () => {
    const itemRows = cart
      .map((item) => {
        const price = Number(item.price || 0)
        const subtotal = Number(item.price * item.quantity || 0)
        return `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">P${price.toLocaleString()}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">P${subtotal.toLocaleString()}</td>
          </tr>
        `
      })
      .join('')

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Receipt ${resolvedReceiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1a1a1a; }
            h1 { margin: 0 0 8px 0; }
            .meta { margin: 16px 0; font-size: 14px; }
            .meta p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px; }
            th { text-align: left; border-bottom: 2px solid #1a1a1a; padding: 8px 0; }
            .right { text-align: right; }
            .center { text-align: center; }
            .total-row { font-weight: 700; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>Wolves Footwear Store</h1>
          <p>Official Purchase Receipt</p>
          <div class="meta">
            <p><strong>Receipt #:</strong> ${resolvedReceiptNumber}</p>
            <p><strong>Customer:</strong> ${resolvedCustomerName}</p>
            <p><strong>Email:</strong> ${resolvedCustomerEmail}</p>
            <p><strong>Date:</strong> ${currentDate}</p>
            <p><strong>Time:</strong> ${currentTime}</p>
            <p><strong>Status:</strong> ${(orderStatus || 'Pending').toUpperCase()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th class="center">QTY</th>
                <th class="right">Price</th>
                <th class="right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
              <tr class="total-row">
                <td colspan="3" style="padding-top: 12px;">TOTAL</td>
                <td class="right" style="padding-top: 12px;">P${Number(total || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 24px;">Thank you for your purchase!</p>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank', 'width=900,height=700')

    if (!printWindow) {
      alert('Please allow pop-ups to download the receipt.')
      return
    }

    printWindow.document.open()
    printWindow.document.write(receiptHtml)
    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
    }
  }

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
              <span className="receipt-value">{resolvedReceiptNumber}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Customer:</span>
              <span className="receipt-value">{resolvedCustomerName}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Email:</span>
              <span className="receipt-value">{resolvedCustomerEmail}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Date:</span>
              <span className="receipt-value">{currentDate}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Time:</span>
              <span className="receipt-value">{currentTime}</span>
            </div>
            <div className="receipt-info-row">
              <span className="receipt-label">Order Status:</span>
              <span className={`receipt-status receipt-status-${resolvedOrderStatus}`}>{(orderStatus || 'Pending').toUpperCase()}</span>
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
                    <td className="receipt-td-right">₱{Number(item.price || 0).toLocaleString()}</td>
                    <td className="receipt-td-right">₱{Number(item.price * item.quantity || 0).toLocaleString()}</td>
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
              <span>₱{Number(total || 0).toLocaleString()}</span>
            </div>
            <div className="receipt-summary-row">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="receipt-summary-row receipt-total">
              <span>TOTAL AMOUNT:</span>
              <span>₱{Number(total || 0).toLocaleString()}</span>
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

          {/* Action Buttons */}
          <div className="receipt-buttons">
            <p className="receipt-sent-info">Order has been sent to admin for processing.</p>
            <button className="receipt-download-btn" onClick={handleDownloadReceipt}>
              Download / Print Receipt
            </button>
            <button className="receipt-close-action-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
