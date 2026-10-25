import api from '@/lib/axios'

// GET /api/enrollments?search=&page=&limit=&sort=
export function fetchEnrollments(params = {}) {
  return api.get('/enrollments', { params }).then((res) => res.data)
}

// POST /api/enrollments (admin, faculty, student) — no update/delete route exists.
export function createEnrollment(payload) {
  return api.post('/enrollments', payload).then((res) => res.data)
}
