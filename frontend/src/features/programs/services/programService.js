import api from '@/lib/axios'

// GET /api/programs?search=&page=&limit=&sort=
export function fetchPrograms(params = {}) {
  return api.get('/programs', { params }).then((res) => res.data)
}

// POST /api/programs (admin only) — no update/delete route exists on backend.
export function createProgram(payload) {
  return api.post('/programs', payload).then((res) => res.data)
}
