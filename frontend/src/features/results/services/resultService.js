import api from '@/lib/axios'

// GET /api/results (no query params supported server-side)
export function fetchResults() {
  return api.get('/results').then((res) => res.data)
}

// POST /api/results/generate (admin only) — backend computes sgpa/cgpa/etc,
// this is not a generic "create a result" endpoint.
export function generateResult(payload) {
  return api.post('/results/generate', payload).then((res) => res.data)
}
