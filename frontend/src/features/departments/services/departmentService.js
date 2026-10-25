import api from '@/lib/axios'

// GET /api/departments?search=&page=&limit=&sort=
export function fetchDepartments(params = {}) {
  return api.get('/departments', { params }).then((res) => res.data)
}

// GET /api/departments/:id
export function fetchDepartmentById(id) {
  return api.get(`/departments/${id}`).then((res) => res.data)
}

// POST /api/departments
export function createDepartment(payload) {
  return api.post('/departments', payload).then((res) => res.data)
}

// PUT /api/departments/:id (admin only)
export function updateDepartment(id, payload) {
  return api.put(`/departments/${id}`, payload).then((res) => res.data)
}

// DELETE /api/departments/:id (admin only, soft delete)
export function deleteDepartment(id) {
  return api.delete(`/departments/${id}`).then((res) => res.data)
}
