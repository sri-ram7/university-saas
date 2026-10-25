import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import {
  fetchStudents,
  fetchStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/studentService'

export function useStudentsList(params) {
  return useQuery({
    queryKey: qk.students.list(params),
    queryFn: () => fetchStudents(params),
    select: (res) => res.data || [],
  })
}

export function useStudentOptions() {
  const { data = [], ...rest } = useStudentsList({ limit: 200 })
  return { options: data.map((s) => ({ value: s._id, label: `${s.name} (${s.email})` })), data, ...rest }
}

export function useStudentDetail(id) {
  return useQuery({
    queryKey: qk.students.detail(id),
    queryFn: () => fetchStudentById(id),
    select: (res) => res.data,
    enabled: !!id,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.students.all })
      toast.success('Student created')
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateStudent(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: qk.students.all })
      queryClient.invalidateQueries({ queryKey: qk.students.detail(variables.id) })
      toast.success('Student updated')
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.students.all })
      toast.success('Student deleted')
    },
  })
}
