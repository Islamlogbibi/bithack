import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { AppUser } from '../types/domain'
import { apiGet, loginRequest } from '../lib/api'

interface AuthContextType {
  user: AppUser | null
  isReady: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshProfile: () => Promise<void>
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
  // isReady = true once we've verified (or cleared) the stored token on mount
  const [isReady, setIsReady] = useState(false)

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('pui_token')
    if (!token) {
      setUser(null)
      setIsReady(true)
      return
    }
    try {
      const profile = await apiGet<AppUser>('/auth/me')
      setUser(profile)
    } catch {
      setUser(null)
      localStorage.removeItem('pui_token')
      localStorage.removeItem('pui_user')
    } finally {
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('pui_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('pui_user')
    }
  }, [user])

  useEffect(() => {
    const token = localStorage.getItem('pui_token')
    if (token) {
      // Always re-validate token on mount
      void refreshProfile()
    } else {
      setIsReady(true)
    }
  }, [refreshProfile])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { accessToken, profile } = await loginRequest(email, password)
      localStorage.setItem('pui_token', accessToken)
      setUser(profile)
      setIsReady(true)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('pui_token')
    localStorage.removeItem('pui_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isReady, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
