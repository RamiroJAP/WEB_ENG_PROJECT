import React from 'react'
import { useProducts } from '../../context/ProductsContext'
import '../../styles/admin/Stocks.css'

const LOW_STOCK_THRESHOLD = 5
const CRITICAL_STOCK_THRESHOLD = 2

export default function Stocks() {
  const { products } = useProducts()

  const sortedProducts = [...products].sort(
    (a, b) => Number(a.stock || 0) - Number(b.stock || 0)
  )

  const lowStockCount = sortedProducts.filter(
    (product) => Number(product.stock || 0) <= LOW_STOCK_THRESHOLD
  ).length

  const getStockStatus = (stock) => {
    const normalizedStock = Number(stock || 0)

    if (normalizedStock <= 0) {
      return { label: 'Out of Stock', className: 'status-out' }
    }
    if (normalizedStock <= CRITICAL_STOCK_THRESHOLD) {
      return { label: 'Critical', className: 'status-critical' }
    }
    if (normalizedStock <= LOW_STOCK_THRESHOLD) {
      return { label: 'Low', className: 'status-low' }
    }

    return { label: 'Healthy', className: 'status-healthy' }
  }

  return (
    <div className="stocks-page">
      <section className="stocks-header">
        <h1 className="stocks-title">Stocks Monitor</h1>
        <p className="stocks-subtitle">
          Track inventory levels and catch low-stock products before they run out.
        </p>
      </section>

      <section className="stocks-summary">
        <div className="stocks-metric">
          <p className="metric-label">Total Products</p>
          <p className="metric-value">{sortedProducts.length}</p>
        </div>
        <div className="stocks-metric warning">
          <p className="metric-label">Low Stock Products (≤ {LOW_STOCK_THRESHOLD})</p>
          <p className="metric-value">{lowStockCount}</p>
        </div>
      </section>

      <section className="stocks-table-wrap">
        <table className="stocks-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => {
              const stock = Number(product.stock || 0)
              const status = getStockStatus(stock)
              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category || 'N/A'}</td>
                  <td>{stock}</td>
                  <td>
                    <span className={`stock-status ${status.className}`}>{status.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
