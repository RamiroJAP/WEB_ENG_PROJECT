import React, { createContext, useContext, useEffect, useState } from 'react'

const ProductsContext = createContext()
const STORAGE_KEY = 'wolvesProducts'
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

const isLegacyDefaultProduct = (product) => {
  if (!product || typeof product !== 'object') return false

  const defaultIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  const looksLikeSeedById = defaultIds.has(Number(product.id))
  const looksLikeSeedImage =
    typeof product.image === 'string' && product.image.startsWith('https://via.placeholder.com/300x300?text=')

  return looksLikeSeedById || looksLikeSeedImage
}

const getInitialProducts = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return []

  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) {
      return parsed
        .filter((product) => !isLegacyDefaultProduct(product))
        .map(normalizeProduct)
    }
    return []
  } catch {
    return []
  }
}

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(getInitialProducts)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      rating: 4.0,
      price: 2999,
      category: 'casual',
      stock: DEFAULT_STOCK,
      ...productData
    }

    setProducts(prev => [normalizeProduct(newProduct), ...prev])
    return newProduct
  }

  const removeProduct = (productId) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
  }

  const reduceProductStocks = (cartItems) => {
    let updateResult = { success: true, insufficient: [] }

    setProducts(prevProducts => {
      const requestedById = cartItems.reduce((acc, item) => {
        const quantity = Number(item.quantity) || 0
        if (quantity > 0) {
          acc[item.id] = (acc[item.id] || 0) + quantity
        }
        return acc
      }, {})

      const insufficient = prevProducts
        .filter(product => requestedById[product.id])
        .filter(product => requestedById[product.id] > normalizeStockValue(product.stock))
        .map(product => ({
          id: product.id,
          name: product.name,
          requested: requestedById[product.id],
          available: normalizeStockValue(product.stock)
        }))

      if (insufficient.length > 0) {
        updateResult = { success: false, insufficient }
        return prevProducts
      }

      return prevProducts.map(product => {
        const requested = requestedById[product.id] || 0
        if (!requested) return product

        const currentStock = normalizeStockValue(product.stock)
        return {
          ...product,
          stock: Math.max(0, currentStock - requested)
        }
      })
    })

    return updateResult
  }

  return (
    <ProductsContext.Provider value={{ products, addProduct, removeProduct, reduceProductStocks }}>
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
