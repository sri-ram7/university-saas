import api from '@/lib/axios'

// GET /api/attendance (no query params supported server-side)
export function fetchAttendance() {
  return api.get('/attendance').then((res) => res.data)
}

// POST /api/attendance (faculty, admin) — no update/delete route exists.
export function createAttendance(payload) {
  return api.post('/attendance', payload).then((res) => res.data)
}
