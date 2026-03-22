import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCheckout } from '../../context/CheckoutContext'
import '../../styles/user/CustomerHome.css'

export default function OrderTracker() {
  const { user } = useAuth()
  const { checkouts } = useCheckout()

  const userOrders = React.useMemo(() => {
    const normalizedUsername = (user?.username || '').trim().toLowerCase()
    const normalizedEmail = (user?.email || '').trim().toLowerCase()

    return checkouts
      .filter((order) => {
        const orderCustomer = (order.customer || '').trim().toLowerCase()
        const orderEmail = (order.email || '').trim().toLowerCase()
        return orderCustomer === normalizedUsername || orderEmail === normalizedEmail
      })
      .sort((a, b) => b.id - a.id)
  }, [checkouts, user?.email, user?.username])

  const getTrackerMessage = (status) => {
    switch (status) {
      case 'Completed':
        return 'Ready to pick up.'
      case 'Shipped':
        return 'On the way to your address.'
      case 'Cancelled':
        return 'Order was cancelled. Please contact support if needed.'
      default:
        return 'Order is being prepared by the admin team.'
    }
  }

  return (
    <div className="user-home">
      <div className="user-container">
        <section className="recent-orders">
          <h2 className="section-heading">Order Tracker</h2>
          {userOrders.length === 0 ? (
            <p className="empty-orders">No orders yet. Your checkout updates will appear here.</p>
          ) : (
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Receipt #</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Tracker</th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.receiptNumber || `#${order.id}`}</td>
                      <td>{order.date}</td>
                      <td>₱{Number(order.total || 0).toLocaleString()}</td>
                      <td>
                        <span className={`order-status ${(order.status || 'Pending').toLowerCase()}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td>{getTrackerMessage(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
