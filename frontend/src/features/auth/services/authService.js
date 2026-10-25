import api from '@/lib/axios'

// POST /api/auth/register
export function registerRequest(payload) {
  return api.post('/auth/register', payload).then((res) => res.data)
}

// POST /api/auth/login -> { user, accessToken, refreshToken }
export function loginRequest(payload) {
  return api.post('/auth/login', payload).then((res) => res.data)
}

// POST /api/auth/logout (Bearer)
export function logoutRequest() {
  return api.post('/auth/logout').then((res) => res.data)
}

// GET /api/auth/verify/:token
export function verifyEmailRequest(token) {
  return api.get(`/auth/verify/${token}`).then((res) => res.data)
}

// POST /api/auth/forgot-password
export function forgotPasswordRequest(payload) {
  return api.post('/auth/forgot-password', payload).then((res) => res.data)
}

// POST /api/auth/reset-password/:token
export function resetPasswordRequest(token, payload) {
  return api.post(`/auth/reset-password/${token}`, payload).then((res) => res.data)
}
