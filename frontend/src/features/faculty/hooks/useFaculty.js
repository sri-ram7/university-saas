import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import {
  fetchFaculty,
  fetchFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from '../services/facultyService'

export function useFacultyList(params) {
  return useQuery({
    queryKey: qk.faculty.list(params),
    queryFn: () => fetchFaculty(params),
    select: (res) => res.data || [],
  })
}

export function useFacultyOptions() {
  const { data = [], ...rest } = useFacultyList({ limit: 200 })
  return { options: data.map((f) => ({ value: f._id, label: f.name })), data, ...rest }
}

export function useFacultyDetail(id) {
  return useQuery({
    queryKey: qk.faculty.detail(id),
    queryFn: () => fetchFacultyById(id),
    select: (res) => res.data,
    enabled: !!id,
  })
}

export function useCreateFaculty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.faculty.all })
      toast.success('Faculty member created')
    },
  })
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateFaculty(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: qk.faculty.all })
      queryClient.invalidateQueries({ queryKey: qk.faculty.detail(variables.id) })
      toast.success('Faculty member updated')
    },
  })
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.faculty.all })
      toast.success('Faculty member deleted')
    },
  })
}
