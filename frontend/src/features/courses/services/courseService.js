import api from '@/lib/axios'

// GET /api/courses?search=&page=&limit=&sort=
export function fetchCourses(params = {}) {
  return api.get('/courses', { params }).then((res) => res.data)
}

// GET /api/courses/:id
export function fetchCourseById(id) {
  return api.get(`/courses/${id}`).then((res) => res.data)
}

// POST /api/courses
export function createCourse(payload) {
  return api.post('/courses', payload).then((res) => res.data)
}

// PUT /api/courses/:id
export function updateCourse(id, payload) {
  return api.put(`/courses/${id}`, payload).then((res) => res.data)
}

// DELETE /api/courses/:id (admin only, soft delete)
export function deleteCourse(id) {
  return api.delete(`/courses/${id}`).then((res) => res.data)
}
