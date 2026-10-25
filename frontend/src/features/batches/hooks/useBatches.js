import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchBatches, createBatch } from '../services/batchService'

export function useBatchesList(params) {
  return useQuery({
    queryKey: qk.batches.list(params),
    queryFn: () => fetchBatches(params),
    select: (res) => res.data || [],
  })
}

export function useBatchOptions() {
  const { data = [], ...rest } = useBatchesList({ limit: 200 })
  return { options: data.map((b) => ({ value: b._id, label: b.name })), data, ...rest }
}

export function useCreateBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.batches.all })
      toast.success('Batch created')
    },
  })
}
