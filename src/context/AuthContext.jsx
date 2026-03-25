import React, { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const defaultAdmin = {
    id: 1,
    username: 'Ryan',
    email: 'arevalo.paulina29@gmail.com',
    password: '123456',
    userType: 'admin'
  }

  const ensureDefaultAdmin = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const hasAdmin = users.some((u) => u.email === defaultAdmin.email)

    if (!hasAdmin) {
      users.push(defaultAdmin)
      localStorage.setItem('users', JSON.stringify(users))
    }
  }

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const resetUserPassword = (email, newPassword) => {
    const normalizedEmail = (email || '').trim().toLowerCase()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(
      (u) => u.userType === 'user' && (u.email || '').toLowerCase() === normalizedEmail
    )

    if (userIndex === -1) {
      return { success: false, message: 'Email not found for a user account' }
    }

    users[userIndex] = {
      ...users[userIndex],
      password: newPassword
    }
    localStorage.setItem('users', JSON.stringify(users))

    return { success: true, message: 'Password updated successfully. Please log in.' }
  }

  // Check if user was logged in before (on app load)
  React.useEffect(() => {
    ensureDefaultAdmin()

    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, resetUserPassword }}>
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
