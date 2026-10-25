import api from '@/lib/axios'

// GET /api/students?search=&page=&limit=&sort= (admin, faculty)
export function fetchStudents(params = {}) {
  return api.get('/students', { params }).then((res) => res.data)
}

// GET /api/students/:id (admin, faculty)
export function fetchStudentById(id) {
  return api.get(`/students/${id}`).then((res) => res.data)
}

// POST /api/students (admin, faculty, student)
export function createStudent(payload) {
  return api.post('/students', payload).then((res) => res.data)
}

// PUT /api/students/:id (admin only)
export function updateStudent(id, payload) {
  return api.put(`/students/${id}`, payload).then((res) => res.data)
}

// DELETE /api/students/:id (admin only, soft delete)
export function deleteStudent(id) {
  return api.delete(`/students/${id}`).then((res) => res.data)
}
