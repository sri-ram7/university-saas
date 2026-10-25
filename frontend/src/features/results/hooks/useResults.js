import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchResults, generateResult } from '../services/resultService'

export function useResultsList() {
  return useQuery({
    queryKey: qk.results.list(),
    queryFn: fetchResults,
    select: (res) => res.data || [],
  })
}

export function useGenerateResult() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: generateResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.results.all })
      toast.success('Result generated')
    },
  })
}
