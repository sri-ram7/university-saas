import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchPrograms, createProgram } from '../services/programService'

export function useProgramsList(params) {
  return useQuery({
    queryKey: qk.programs.list(params),
    queryFn: () => fetchPrograms(params),
    select: (res) => res.data || [],
  })
}

export function useProgramOptions() {
  const { data = [], ...rest } = useProgramsList({ limit: 200 })
  return { options: data.map((p) => ({ value: p._id, label: p.name })), data, ...rest }
}

export function useCreateProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.programs.all })
      toast.success('Program created')
    },
  })
}
