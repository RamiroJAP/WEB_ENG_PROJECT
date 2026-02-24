import React, { createContext, useState, useContext, useEffect } from 'react'

const CheckoutContext = createContext()

const defaultCheckouts = [
  { 
    id: 1, 
    customer: 'John Doe', 
    email: 'john@example.com', 
    total: 5999, 
    status: 'Pending', 
    date: '2026-02-24',
    items: [
      { id: 1, name: 'Product 1', quantity: 2, price: 2999 }
    ],
    receiptNumber: 'RCP001'
  },
  { 
    id: 2, 
    customer: 'Jane Smith', 
    email: 'jane@example.com', 
    total: 3500, 
    status: 'Completed', 
    date: '2026-02-23',
    items: [
      { id: 2, name: 'Product 2', quantity: 1, price: 3500 }
    ],
    receiptNumber: 'RCP002'
  },
  { 
    id: 3, 
    customer: 'Mark Johnson', 
    email: 'mark@example.com', 
    total: 8999, 
    status: 'Pending', 
    date: '2026-02-22',
    items: [
      { id: 3, name: 'Product 3', quantity: 1, price: 8999 }
    ],
    receiptNumber: 'RCP003'
  },
  { 
    id: 4, 
    customer: 'Sarah Williams', 
    email: 'sarah@example.com', 
    total: 4299, 
    status: 'Shipped', 
    date: '2026-02-21',
    items: [
      { id: 4, name: 'Product 4', quantity: 1, price: 4299 }
    ],
    receiptNumber: 'RCP004'
  },
]

export const CheckoutProvider = ({ children }) => {
  const [checkouts, setCheckouts] = useState(() => {
    const savedCheckouts = localStorage.getItem('checkouts')
    return savedCheckouts ? JSON.parse(savedCheckouts) : defaultCheckouts
  })

  // Save to localStorage whenever checkouts change
  useEffect(() => {
    localStorage.setItem('checkouts', JSON.stringify(checkouts))
  }, [checkouts])

  const addCheckout = (checkoutData) => {
    const newCheckout = {
      id: checkouts.length + 1,
      ...checkoutData,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    }
    setCheckouts([newCheckout, ...checkouts])
    return newCheckout
  }

  const updateCheckoutStatus = (id, newStatus) => {
    setCheckouts(checkouts.map(c =>
      c.id === id ? { ...c, status: newStatus } : c
    ))
  }

  const deleteCheckout = (id) => {
    setCheckouts(checkouts.filter(c => c.id !== id))
  }

  const getCheckoutById = (id) => {
    return checkouts.find(c => c.id === id)
  }

  return (
    <CheckoutContext.Provider
      value={{
        checkouts,
        addCheckout,
        updateCheckoutStatus,
        deleteCheckout,
        getCheckoutById
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider')
  }
  return context
}
