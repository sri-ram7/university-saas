import api from '@/lib/axios'

// GET /api/course-offerings (no query params supported server-side)
export function fetchCourseOfferings() {
  return api.get('/course-offerings').then((res) => res.data)
}

// POST /api/course-offerings (admin only) — no update/delete route exists.
export function createCourseOffering(payload) {
  return api.post('/course-offerings', payload).then((res) => res.data)
}
