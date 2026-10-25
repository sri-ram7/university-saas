import api from '@/lib/axios'

// GET /api/dashboard
export function fetchDashboard() {
  return api.get('/dashboard').then((res) => res.data)
}
