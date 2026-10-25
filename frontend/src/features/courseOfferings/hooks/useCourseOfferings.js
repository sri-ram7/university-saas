import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchCourseOfferings, createCourseOffering } from '../services/courseOfferingService'

export function useCourseOfferingsList() {
  return useQuery({
    queryKey: qk.courseOfferings.list(),
    queryFn: fetchCourseOfferings,
    select: (res) => res.data || [],
  })
}

export function useCourseOfferingOptions() {
  const { data = [], ...rest } = useCourseOfferingsList()
  return {
    options: data.map((o) => ({
      value: o._id,
      label: `${o.course?.code || 'Course'} · ${o.section?.name || ''} · ${o.semester?.name || ''}`,
    })),
    data,
    ...rest,
  }
}

export function useCreateCourseOffering() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCourseOffering,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.courseOfferings.all })
      toast.success('Course offering created')
    },
  })
}
