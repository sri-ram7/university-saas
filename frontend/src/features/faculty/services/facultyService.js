import api from '@/lib/axios'

// GET /api/faculties?search=&page=&limit=&sort=
export function fetchFaculty(params = {}) {
  return api.get('/faculties', { params }).then((res) => res.data)
}

// GET /api/faculties/:id
export function fetchFacultyById(id) {
  return api.get(`/faculties/${id}`).then((res) => res.data)
}

// POST /api/faculties (student, faculty, admin)
export function createFaculty(payload) {
  return api.post('/faculties', payload).then((res) => res.data)
}

// PUT /api/faculties/:id (admin only)
export function updateFaculty(id, payload) {
  return api.put(`/faculties/${id}`, payload).then((res) => res.data)
}

// DELETE /api/faculties/:id (admin only, soft delete)
export function deleteFaculty(id) {
  return api.delete(`/faculties/${id}`).then((res) => res.data)
}
