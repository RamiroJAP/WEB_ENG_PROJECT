import React, { createContext, useEffect, useState, useContext } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const buildAppUser = (firebaseUser, profile = {}) => ({
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    username:
      profile.username ||
      firebaseUser.displayName ||
      firebaseUser.email?.split('@')[0] ||
      'User',
    userType: profile.userType || 'user'
  })

  const login = (userData) => {
    // Legacy fallback for existing pages while Firebase auth is being adopted.
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const loginWithEmail = async (email, password, expectedUserType) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const userRef = doc(db, 'users', credential.user.uid)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid: credential.user.uid,
        username: credential.user.email?.split('@')[0] || 'User',
        email: credential.user.email,
        userType: 'user',
        createdAt: serverTimestamp()
      })
    }

    const profile = snapshot.exists()
      ? snapshot.data()
      : {
          username: credential.user.email?.split('@')[0] || 'User',
          userType: 'user'
        }

    const appUser = buildAppUser(credential.user, profile)

    if (expectedUserType && appUser.userType !== expectedUserType) {
      await signOut(auth)
      throw new Error(`This account is not allowed for ${expectedUserType} login.`)
    }

    setUser(appUser)
    localStorage.setItem('currentUser', JSON.stringify(appUser))
    return appUser
  }

  const signupWithEmail = async ({ email, password, userType = 'user' }) => {
    const emailPrefix = email?.split('@')[0] || 'User'

    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const profile = {
      uid: credential.user.uid,
      username: emailPrefix,
      usernameLower: emailPrefix.toLowerCase(),
      email,
      userType,
      createdAt: serverTimestamp()
    }

    await setDoc(doc(db, 'users', credential.user.uid), profile)

    const appUser = buildAppUser(credential.user, profile)
    setUser(appUser)
    localStorage.setItem('currentUser', JSON.stringify(appUser))
    return appUser
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      // If signOut fails because of temporary network issues, still clear local state.
      console.error('Logout warning:', error)
    }
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        localStorage.removeItem('currentUser')
        setLoading(false)
        return
      }

      const userRef = doc(db, 'users', firebaseUser.uid)
      const snapshot = await getDoc(userRef)

      const profile = snapshot.exists()
        ? snapshot.data()
        : {
            username: firebaseUser.email?.split('@')[0] || 'User',
            userType: 'user'
          }

      const appUser = buildAppUser(firebaseUser, profile)
      setUser(appUser)
      localStorage.setItem('currentUser', JSON.stringify(appUser))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
