import axios from 'axios'
import { getStoredAuth, setStoredTokens, clearStoredAuth } from '@/features/auth/utils/authStorage'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const { accessToken } = getStoredAuth()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let isRefreshing = false
let pendingQueue = []

function flushQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  pendingQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const isAuthRoute = originalRequest?.url?.includes('/auth/')

    if (status !== 401 || isAuthRoute || originalRequest._retry) {
      return Promise.reject(error)
    }

    const { refreshToken } = getStoredAuth()
    if (!refreshToken) {
      clearStoredAuth()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken }, { withCredentials: true })
      const newAccessToken = data?.data?.token || data?.data?.accessToken
      const newRefreshToken = data?.data?.refreshToken || refreshToken
      if (!newAccessToken) throw new Error('No token returned from refresh')

      setStoredTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken })
      flushQueue(null, newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      flushQueue(refreshError, null)
      clearStoredAuth()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
