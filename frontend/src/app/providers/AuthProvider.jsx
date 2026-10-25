import { createContext, useContext, useMemo, useState } from 'react'
import { loginRequest, logoutRequest, registerRequest } from '@/features/auth/services/authService'
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '@/features/auth/utils/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth)

  const login = async (credentials) => {
    const res = await loginRequest(credentials)
    const { user, accessToken, refreshToken } = res.data
    const nextAuth = { user, accessToken, refreshToken }
    setStoredAuth(nextAuth)
    setAuth(nextAuth)
    return user
  }

  const register = async (payload) => {
    const res = await registerRequest(payload)
    return res.data
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } finally {
      clearStoredAuth()
      setAuth({ user: null, accessToken: null, refreshToken: null })
    }
  }

  const value = useMemo(
    () => ({
      user: auth.user,
      accessToken: auth.accessToken,
      isAuthenticated: !!auth.accessToken,
      role: auth.user?.role || null,
      login,
      register,
      logout,
    }),
    [auth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
