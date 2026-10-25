import api from '@/lib/axios'

// GET /api/marks (no query params supported server-side)
export function fetchMarks() {
  return api.get('/marks').then((res) => res.data)
}

// POST /api/marks (faculty, admin) — no update/delete route exists.
export function createMark(payload) {
  return api.post('/marks', payload).then((res) => res.data)
}
