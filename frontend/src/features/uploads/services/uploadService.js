import api from '@/lib/axios'

// POST /api/uploads (multipart/form-data, field name must be "file")
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return api
    .post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)
}
