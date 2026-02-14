import React from 'react'

export default function Dashboard(){
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="grid">
        <div className="card">Orders Summary</div>
        <div className="card">Top Products</div>
        <div className="card">User Activity</div>
        <div className="card">Sales</div>
      </div>
    </div>
  )
}
