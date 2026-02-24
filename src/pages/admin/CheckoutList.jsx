import React, { useState } from 'react'
import { useCheckout } from '../../context/CheckoutContext'
import ReceiptModal from './ReceiptModal'
import '../../styles/admin/CheckoutList.css'

export default function CheckoutList() {
  const { checkouts, updateCheckoutStatus, deleteCheckout } = useCheckout()
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedCheckoutId, setSelectedCheckoutId] = useState(null)

  const filteredCheckouts = filterStatus === 'All' 
    ? checkouts 
    : checkouts.filter(c => c.status === filterStatus)

  const handleStatusChange = (id, newStatus) => {
    updateCheckoutStatus(id, newStatus)
  }

  const handleDeleteCheckout = (id) => {
    if (window.confirm('Are you sure you want to delete this checkout?')) {
      deleteCheckout(id)
    }
  }

  const handleViewReceipt = (id) => {
    setSelectedCheckoutId(id)
  }

  const handleCloseReceipt = () => {
    setSelectedCheckoutId(null)
  }

  return (
    <div className="checkout-list-container">
      <h1>Checkout List</h1>
      
      <div className="filter-section">
        <label>Filter by Status:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Shipped</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="checkouts-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Total (₱)</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCheckouts.map(checkout => (
              <tr key={checkout.id}>
                <td>#{checkout.id}</td>
                <td>{checkout.customer}</td>
                <td>{checkout.email}</td>
                <td>₱{checkout.total.toLocaleString()}</td>
                <td>
                  <select 
                    value={checkout.status} 
                    onChange={(e) => handleStatusChange(checkout.id, e.target.value)}
                    className={`status-select status-${checkout.status.toLowerCase()}`}
                  >
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Shipped</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td>{checkout.date}</td>
                <td>
                  <button 
                    className="view-receipt-btn"
                    onClick={() => handleViewReceipt(checkout.id)}
                  >
                    View Receipt
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteCheckout(checkout.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCheckouts.length === 0 && (
          <p className="no-data">No checkouts found</p>
        )}
      </div>

      <div className="summary">
        <p>Total Checkouts: <strong>{filteredCheckouts.length}</strong></p>
        <p>Total Revenue: <strong>₱{filteredCheckouts.reduce((sum, c) => sum + c.total, 0).toLocaleString()}</strong></p>
      </div>

      {selectedCheckoutId && (
        <ReceiptModal checkoutId={selectedCheckoutId} onClose={handleCloseReceipt} />
      )}
    </div>
  )
}
