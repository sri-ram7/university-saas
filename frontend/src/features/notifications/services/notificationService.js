import api from '@/lib/axios'

// GET /api/notifications
export function fetchNotifications() {
  return api.get('/notifications').then((res) => res.data)
}

// POST /api/notifications (admin only)
export function createNotification(payload) {
  return api.post('/notifications', payload).then((res) => res.data)
}
