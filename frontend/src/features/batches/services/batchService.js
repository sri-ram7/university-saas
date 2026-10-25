import api from '@/lib/axios'

// GET /api/batches?search=&page=&limit=&sort=
export function fetchBatches(params = {}) {
  return api.get('/batches', { params }).then((res) => res.data)
}

// POST /api/batches (admin only) — no update/delete route exists on backend.
export function createBatch(payload) {
  return api.post('/batches', payload).then((res) => res.data)
}
