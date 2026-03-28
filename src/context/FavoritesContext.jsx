import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext()
const STORAGE_KEY = 'wolvesFavorites'

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Initialize from localStorage as fallback
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        setFavorites(parsed)
      }
    } catch (err) {
      console.error('[FavoritesContext] Failed to parse localStorage:', err)
    }
  }, [])

  // Set up real-time listener when user is authenticated
  useEffect(() => {
    if (!user) {
      setFavorites([])
      setIsLoading(false)
      return
    }

    const favoritesRef = collection(db, 'favorites')
    const userQuery = query(favoritesRef, where('userId', '==', user.id || user.email))

    const unsubscribe = onSnapshot(
      userQuery,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => ({
          firebaseId: docSnap.id,
          ...docSnap.data()
        }))
        setFavorites(next)
        setIsLoading(false)
        
        if (import.meta.env.DEV) {
          console.log('[FavoritesContext] Favorites synced:', next.length, 'items')
        }
      },
      (err) => {
        console.error('[FavoritesContext] Failed to load favorites:', err)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const addToFavorites = async (product) => {
    if (!user) {
      console.warn('[FavoritesContext] Cannot add to favorites: user not authenticated')
      return
    }

    const exists = favorites.some(item => item.id === product.id)
    if (exists) return

    try {
      const userId = user.id || user.email
      await addDoc(collection(db, 'favorites'), {
        userId,
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        addedAt: new Date().toISOString()
      })
    } catch (err) {
      console.error('[FavoritesContext] Failed to add favorite:', err)
    }
  }

  const removeFromFavorites = async (productId) => {
    try {
      const favorite = favorites.find(item => item.id === productId)
      if (favorite?.firebaseId) {
        await deleteDoc(doc(db, 'favorites', favorite.firebaseId))
      }
    } catch (err) {
      console.error('[FavoritesContext] Failed to remove favorite:', err)
    }
  }

  const isFavorited = (productId) => {
    return favorites.some(item => item.id === productId)
  }

  const getFavoritesCount = () => {
    return favorites.length
  }

  const value = useMemo(
    () => ({
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorited,
      getFavoritesCount,
      isLoading
    }),
    [favorites, isLoading]
  )

  return (
    <FavoritesContext.Provider value={value}>
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
