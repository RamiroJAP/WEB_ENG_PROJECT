import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore'
import { db } from '../firebase'

const CheckoutContext = createContext()

const normalizeStatus = (status) => (status === 'Shipped' ? 'Pick Up' : status)

const normalizeCheckout = (checkout) => {
  const normalizedStatus = normalizeStatus(checkout.status)
  const hasStockDeducted = typeof checkout.stockDeducted === 'boolean'

  return {
    ...checkout,
    status: normalizedStatus,
    stockDeducted: hasStockDeducted ? checkout.stockDeducted : normalizedStatus === 'Completed'
  }
}

export const CheckoutProvider = ({ children }) => {
  const [checkouts, setCheckouts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const ref = collection(db, 'checkouts')

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const next = snapshot.docs
          .map((docSnap) => normalizeCheckout({ id: docSnap.id, ...docSnap.data() }))
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0
            const bTime = b.createdAt?.seconds || 0
            return bTime - aTime
          })
        setCheckouts(next)
        setIsLoading(false)
      },
      (err) => {
        console.error('[CheckoutContext] Failed to load checkouts:', err)
        setCheckouts([])
        setIsLoading(false)
      }
    )

    return unsubscribe
  }, [])

  const addCheckout = async (checkoutData) => {
    const payload = {
      ...checkoutData,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      stockDeducted: false,
      createdAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, 'checkouts'), payload)
    return { id: docRef.id, ...payload }
  }

  const updateCheckoutStatus = async (id, newStatus, extraUpdates = {}) => {
    await updateDoc(doc(db, 'checkouts', String(id)), {
      status: normalizeStatus(newStatus),
      ...extraUpdates
    })
  }

  const deleteCheckout = async (id) => {
    await deleteDoc(doc(db, 'checkouts', String(id)))
  }

  const getCheckoutById = (id) => checkouts.find((c) => c.id === id)

  const value = useMemo(
    () => ({
      checkouts,
      addCheckout,
      updateCheckoutStatus,
      deleteCheckout,
      getCheckoutById,
      isLoading
    }),
    [checkouts, isLoading]
  )

  return (
    <CheckoutContext.Provider
      value={value}
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
