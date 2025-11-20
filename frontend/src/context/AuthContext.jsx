import { createContext, useEffect, useMemo, useState } from 'react'
import { getProfile, login as loginApi, register as registerApi } from '../api/auth'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const { data } = await getProfile()
        setUser(data.user)
      } catch (err) {
        console.error(err)
        handleLogout()
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [token])

  const handleLogin = async (credentials) => {
    setError(null)
    try {
      const { data } = await loginApi(credentials)
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login')
      throw err
    }
  }

  const handleRegister = async (payload) => {
    setError(null)
    try {
      const { data } = await registerApi(payload)
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register')
      throw err
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    if (!token) return
    try {
      const { data } = await getProfile()
      setUser(data.user)
      return data.user
    } catch (err) {
      console.error('Error refreshing user:', err)
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      refreshUser,
      setError,
    }),
    [user, token, loading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

