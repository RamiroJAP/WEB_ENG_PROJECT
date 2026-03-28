import React, { createContext, useState, useContext, useEffect, useMemo } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  writeBatch
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Set up real-time listener for cart
  useEffect(() => {
    if (!user) {
      setCart([])
      setIsLoading(false)
      return
    }

    const cartRef = collection(db, 'carts')
    const userQuery = query(cartRef, where('userId', '==', user.id || user.email))

    const unsubscribe = onSnapshot(
      userQuery,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => ({
          firebaseId: docSnap.id,
          ...docSnap.data()
        }))
        setCart(next)
        setIsLoading(false)
        
        if (import.meta.env.DEV) {
          console.log('[CartContext] Cart synced:', next.length, 'items')
        }
      },
      (err) => {
        console.error('[CartContext] Failed to load cart:', err)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const addToCart = async (product) => {
    if (!user) {
      console.warn('[CartContext] Cannot add to cart: user not authenticated')
      return
    }

    try {
      const userId = user.id || user.email
      const existingItem = cart.find(item => item.id === product.id)

      if (existingItem?.firebaseId) {
        // Update quantity if item already in cart
        await updateDoc(doc(db, 'carts', existingItem.firebaseId), {
          quantity: (existingItem.quantity || 1) + 1,
          updatedAt: new Date().toISOString()
        })
      } else {
        // Add new item to cart
        await addDoc(collection(db, 'carts'), {
          userId,
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('[CartContext] Failed to add to cart:', err)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const item = cart.find(item => item.id === productId)
      if (item?.firebaseId) {
        await deleteDoc(doc(db, 'carts', item.firebaseId))
      }
    } catch (err) {
      console.error('[CartContext] Failed to remove from cart:', err)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    try {
      const item = cart.find(item => item.id === productId)
      if (item?.firebaseId) {
        await updateDoc(doc(db, 'carts', item.firebaseId), {
          quantity,
          updatedAt: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('[CartContext] Failed to update quantity:', err)
    }
  }

  const clearCart = async () => {
    try {
      if (!user) return

      const batch = writeBatch(db)
      cart.forEach((item) => {
        if (item.firebaseId) {
          batch.delete(doc(db, 'carts', item.firebaseId))
        }
      })
      await batch.commit()
    } catch (err) {
      console.error('[CartContext] Failed to clear cart:', err)
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0)
  }

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      isLoading
    }),
    [cart, isLoading, user]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
