import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchMarks, createMark } from '../services/markService'

export function useMarksList() {
  return useQuery({
    queryKey: qk.marks.list(),
    queryFn: fetchMarks,
    select: (res) => res.data || [],
  })
}

export function useCreateMark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.marks.all })
      toast.success('Marks recorded')
    },
  })
}
