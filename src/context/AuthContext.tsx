import React, { createContext, useContext, useState, useEffect } from 'react'
import { AppUser, TEST_USERS } from '../data/users'

interface AuthContextType {
  user: AppUser | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const stored = localStorage.getItem('pui_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('pui_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('pui_user')
    }
  }, [user])

  const login = (email: string, password: string): boolean => {
    const found = TEST_USERS.find(
      (u) => u.email === email && u.password === password
    )
    if (found) {
      setUser(found)
      return true
    }
    return false
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
