import React, { useState } from 'react'
import '../../styles/admin/CheckoutList.css'

export default function CheckoutList() {
  const [checkouts, setCheckouts] = useState([
    { id: 1, customer: 'John Doe', email: 'john@example.com', total: 5999, status: 'Pending', date: '2026-02-24' },
    { id: 2, customer: 'Jane Smith', email: 'jane@example.com', total: 3500, status: 'Completed', date: '2026-02-23' },
    { id: 3, customer: 'Mark Johnson', email: 'mark@example.com', total: 8999, status: 'Pending', date: '2026-02-22' },
    { id: 4, customer: 'Sarah Williams', email: 'sarah@example.com', total: 4299, status: 'Shipped', date: '2026-02-21' },
  ])

  const [filterStatus, setFilterStatus] = useState('All')

  const filteredCheckouts = filterStatus === 'All' 
    ? checkouts 
    : checkouts.filter(c => c.status === filterStatus)

  const handleStatusChange = (id, newStatus) => {
    setCheckouts(checkouts.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ))
  }

  const handleDeleteCheckout = (id) => {
    if (window.confirm('Are you sure you want to delete this checkout?')) {
      setCheckouts(checkouts.filter(c => c.id !== id))
    }
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
    </div>
  )
}
