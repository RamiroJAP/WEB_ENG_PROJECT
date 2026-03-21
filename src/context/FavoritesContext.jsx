import React, { createContext, useContext, useEffect, useState } from 'react'

const FavoritesContext = createContext()
const STORAGE_KEY = 'wolvesFavorites'

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []

    try {
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (product) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === product.id)
      if (exists) return prev
      return [...prev, product]
    })
  }

  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId))
  }

  const isFavorited = (productId) => {
    return favorites.some(item => item.id === productId)
  }

  const getFavoritesCount = () => {
    return favorites.length
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorited,
        getFavoritesCount
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
