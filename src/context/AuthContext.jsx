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

  // Check if user was logged in before (on app load)
  React.useEffect(() => {
    ensureDefaultAdmin()

    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
