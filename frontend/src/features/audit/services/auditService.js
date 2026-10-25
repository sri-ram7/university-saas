import api from '@/lib/axios'

// GET /api/audit-logs (admin only, no query params supported server-side)
export function fetchAuditLogs() {
  return api.get('/audit-logs').then((res) => res.data)
}
