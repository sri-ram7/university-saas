import api from '@/lib/axios'

// GET /api/exams (no query params supported server-side)
export function fetchExams() {
  return api.get('/exams').then((res) => res.data)
}

// POST /api/exams (admin, faculty) — no update/delete route exists.
export function createExam(payload) {
  return api.post('/exams', payload).then((res) => res.data)
}
