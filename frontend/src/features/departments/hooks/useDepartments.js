import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../services/departmentService'

export function useDepartmentsList(params) {
  return useQuery({
    queryKey: qk.departments.list(params),
    queryFn: () => fetchDepartments(params),
    select: (res) => res.data || [],
  })
}

// Lightweight fetch for populating <Select> options in other features.
export function useDepartmentOptions() {
  const { data = [], ...rest } = useDepartmentsList({ limit: 200 })
  return { options: data.map((d) => ({ value: d._id, label: d.name })), data, ...rest }
}

export function useDepartmentDetail(id) {
  return useQuery({
    queryKey: qk.departments.detail(id),
    queryFn: () => fetchDepartmentById(id),
    select: (res) => res.data,
    enabled: !!id,
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.departments.all })
      toast.success('Department created')
    },
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateDepartment(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: qk.departments.all })
      queryClient.invalidateQueries({ queryKey: qk.departments.detail(variables.id) })
      toast.success('Department updated')
    },
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.departments.all })
      toast.success('Department deleted')
    },
  })
}
