import React, { createContext, useContext, useEffect, useState } from 'react'

const ProductsContext = createContext()
const STORAGE_KEY = 'wolvesProducts'
const DEFAULT_STOCK = 20

const defaultProducts = [
  {
    id: 1,
    name: 'Classic Running Sneakers',
    category: 'running',
    price: 4500,
    image: 'https://via.placeholder.com/300x300?text=Running+Shoe+1',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Casual Street Shoes',
    category: 'casual',
    price: 3500,
    image: 'https://via.placeholder.com/300x300?text=Casual+Shoe+1',
    rating: 4.2
  },
  {
    id: 3,
    name: 'Basketball Peak Shoes',
    category: 'basketball',
    price: 5500,
    image: 'https://via.placeholder.com/300x300?text=Basketball+1',
    rating: 4.8
  },
  {
    id: 4,
    name: 'Training Elite Flex',
    category: 'training',
    price: 4800,
    image: 'https://via.placeholder.com/300x300?text=Training+1',
    rating: 4.6
  },
  {
    id: 5,
    name: 'Casual Loafers',
    category: 'casual',
    price: 2800,
    image: 'https://via.placeholder.com/300x300?text=Loafer+1',
    rating: 4.3
  },
  {
    id: 6,
    name: 'Marathon Pro',
    category: 'running',
    price: 5200,
    image: 'https://via.placeholder.com/300x300?text=Marathon+1',
    rating: 4.7
  },
  {
    id: 7,
    name: 'Formal Oxford',
    category: 'formal',
    price: 3800,
    image: 'https://via.placeholder.com/300x300?text=Formal+1',
    rating: 4.4
  },
  {
    id: 8,
    name: 'Sports Court Shoes',
    category: 'basketball',
    price: 5000,
    image: 'https://via.placeholder.com/300x300?text=Court+1',
    rating: 4.5
  },
  {
    id: 9,
    name: 'Training Force Plus',
    category: 'training',
    price: 4200,
    image: 'https://via.placeholder.com/300x300?text=Training+2',
    rating: 4.4
  },
  {
    id: 10,
    name: 'Urban Sneaker Style',
    category: 'casual',
    price: 3200,
    image: 'https://via.placeholder.com/300x300?text=Urban+1',
    rating: 4.1
  },
  {
    id: 11,
    name: 'Running Sprint Max',
    category: 'running',
    price: 4900,
    image: 'https://via.placeholder.com/300x300?text=Sprint+1',
    rating: 4.6
  },
  {
    id: 12,
    name: 'Wellness Walk Pro',
    category: 'casual',
    price: 2500,
    image: 'https://via.placeholder.com/300x300?text=Walk+1',
    rating: 4.0
  }
]

const normalizeStockValue = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric < 0) return DEFAULT_STOCK
  return Math.floor(numeric)
}

const normalizeProduct = (product) => ({
  ...product,
  stock: normalizeStockValue(product.stock)
})

const getInitialProducts = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return defaultProducts.map(normalizeProduct)

  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(normalizeProduct)
    }
    return defaultProducts.map(normalizeProduct)
  } catch {
    return defaultProducts.map(normalizeProduct)
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
