import api from '@/lib/axios'

// GET /api/sections?search=&page=&limit=&sort=
export function fetchSections(params = {}) {
  return api.get('/sections', { params }).then((res) => res.data)
}

// POST /api/sections (admin only) — no update/delete route exists on backend.
export function createSection(payload) {
  return api.post('/sections', payload).then((res) => res.data)
}
