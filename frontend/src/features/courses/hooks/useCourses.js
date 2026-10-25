import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import {
  fetchCourses,
  fetchCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../services/courseService'

export function useCoursesList(params) {
  return useQuery({
    queryKey: qk.courses.list(params),
    queryFn: () => fetchCourses(params),
    select: (res) => res.data || [],
  })
}

export function useCourseOptions() {
  const { data = [], ...rest } = useCoursesList({ limit: 200 })
  return { options: data.map((c) => ({ value: c._id, label: `${c.code} — ${c.name}` })), data, ...rest }
}

export function useCourseDetail(id) {
  return useQuery({
    queryKey: qk.courses.detail(id),
    queryFn: () => fetchCourseById(id),
    select: (res) => res.data,
    enabled: !!id,
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.courses.all })
      toast.success('Course created')
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateCourse(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: qk.courses.all })
      queryClient.invalidateQueries({ queryKey: qk.courses.detail(variables.id) })
      toast.success('Course updated')
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.courses.all })
      toast.success('Course deleted')
    },
  })
}
