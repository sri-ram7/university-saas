import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchSections, createSection } from '../services/sectionService'

export function useSectionsList(params) {
  return useQuery({
    queryKey: qk.sections.list(params),
    queryFn: () => fetchSections(params),
    select: (res) => res.data || [],
  })
}

export function useSectionOptions() {
  const { data = [], ...rest } = useSectionsList({ limit: 200 })
  return { options: data.map((s) => ({ value: s._id, label: s.name })), data, ...rest }
}

export function useCreateSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.sections.all })
      toast.success('Section created')
    },
  })
}
