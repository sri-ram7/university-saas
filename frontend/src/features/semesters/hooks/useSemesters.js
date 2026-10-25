import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchSemesters, createSemester } from '../services/semesterService'

export function useSemestersList(params) {
  return useQuery({
    queryKey: qk.semesters.list(params),
    queryFn: () => fetchSemesters(params),
    select: (res) => res.data || [],
  })
}

export function useSemesterOptions() {
  const { data = [], ...rest } = useSemestersList({ limit: 200 })
  return { options: data.map((s) => ({ value: s._id, label: s.name })), data, ...rest }
}

export function useCreateSemester() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSemester,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.semesters.all })
      toast.success('Semester created')
    },
  })
}
