import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '../firebase'

const ProductsContext = createContext()
const DEFAULT_STOCK = 20

const normalizeStockValue = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric < 0) return DEFAULT_STOCK
  return Math.floor(numeric)
}

const normalizeProduct = (product) => ({
  ...product,
  stock: normalizeStockValue(product.stock)
})

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    let unsubscribe = null

    const setupListener = () => {
      try {
        const productsRef = collection(db, 'products')

        unsubscribe = onSnapshot(
          productsRef,
          (snapshot) => {
            const next = snapshot.docs
              .map((docSnap) => normalizeProduct({ id: docSnap.id, ...docSnap.data() }))
              .sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0
                const bTime = b.createdAt?.seconds || 0
                return bTime - aTime
              })

            setProducts(next)
            setIsLoading(false)
            setIsConnected(true)
            
            if (import.meta.env.DEV) {
              console.log('[ProductsContext] Products synced:', next.length, 'items')
            }
          },
          (err) => {
            console.error('[ProductsContext] Firestore error:', err.code, err.message)
            setIsConnected(false)
            setIsLoading(false)
            
            // Retry connection after 5 seconds if it's a network error
            if (err.code === 'unavailable' || err.code === 'failed-precondition') {
              setTimeout(() => {
                console.log('[ProductsContext] Attempting to reconnect...')
                setupListener()
              }, 5000)
            }
          }
        )
      } catch (err) {
        console.error('[ProductsContext] Failed to setup listener:', err)
        setIsLoading(false)
      }
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const addProduct = async (productData) => {
    const productToCreate = {
      rating: 4.0,
      price: 2999,
      category: 'casual',
      stock: DEFAULT_STOCK,
      ...productData,
      createdAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, 'products'), productToCreate)
    return { id: docRef.id, ...productToCreate }
  }

  const removeProduct = async (productId) => {
    await deleteDoc(doc(db, 'products', String(productId)))
  }

  const reduceProductStocks = async (cartItems) => {
    const requestedById = cartItems.reduce((acc, item) => {
      const quantity = Number(item.quantity) || 0
      if (quantity > 0) {
        const key = String(item.id)
        acc[key] = (acc[key] || 0) + quantity
      }
      return acc
    }, {})

    // Validate stock availability
    const insufficient = products
      .filter((product) => requestedById[String(product.id)])
      .filter(
        (product) =>
          requestedById[String(product.id)] > normalizeStockValue(product.stock)
      )
      .map((product) => ({
        id: product.id,
        name: product.name,
        requested: requestedById[String(product.id)],
        available: normalizeStockValue(product.stock)
      }))

    if (insufficient.length > 0) {
      return { success: false, insufficient }
    }

    // Calculate next state
    const nextProducts = products.map((product) => {
      const requested = requestedById[String(product.id)] || 0
      if (!requested) return product

      const currentStock = normalizeStockValue(product.stock)
      return {
        ...product,
        stock: Math.max(0, currentStock - requested)
      }
    })

    // First persist to Firebase, then update local state
    try {
      const batch = writeBatch(db)
      nextProducts.forEach((product) => {
        if (requestedById[String(product.id)]) {
          batch.update(doc(db, 'products', String(product.id)), {
            stock: normalizeStockValue(product.stock)
          })
        }
      })
      await batch.commit()
      // Let onSnapshot handle the update to keep state in sync
      if (import.meta.env.DEV) {
        console.log('[ProductsContext] Stock reduction committed successfully')
      }
    } catch (err) {
      console.error('[ProductsContext] Failed to persist stock changes:', err)
      throw new Error('Failed to update product stock. Please try again.')
    }

    return { success: true, insufficient: [] }
  }

  const refreshProducts = async () => {
    setIsLoading(true)
    // Force a refresh of the listener
    try {
      if (import.meta.env.DEV) {
        console.log('[ProductsContext] Forcing products refresh...')
      }
    } catch (err) {
      console.error('[ProductsContext] Refresh failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const value = useMemo(
    () => ({ 
      products, 
      addProduct, 
      removeProduct, 
      reduceProductStocks, 
      isLoading,
      isConnected,
      refreshProducts
    }),
    [products, isLoading, isConnected]
  )

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider')
  }
  return context
}
