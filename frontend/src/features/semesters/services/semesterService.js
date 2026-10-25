import api from '@/lib/axios'

// GET /api/semesters?search=&page=&limit=&sort=
export function fetchSemesters(params = {}) {
  return api.get('/semesters', { params }).then((res) => res.data)
}

// POST /api/semesters (admin only) — no update/delete route exists on backend.
export function createSemester(payload) {
  return api.post('/semesters', payload).then((res) => res.data)
}
