const STORAGE_KEY = 'univ_console_auth'

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, accessToken: null, refreshToken: null }
    return JSON.parse(raw)
  } catch {
    return { user: null, accessToken: null, refreshToken: null }
  }
}

export function setStoredAuth({ user, accessToken, refreshToken }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, accessToken, refreshToken }))
}

export function setStoredTokens({ accessToken, refreshToken }) {
  const current = getStoredAuth()
  setStoredAuth({ ...current, accessToken, refreshToken })
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY)
}
