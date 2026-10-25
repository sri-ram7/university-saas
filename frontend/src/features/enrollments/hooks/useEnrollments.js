import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchEnrollments, createEnrollment } from '../services/enrollmentService'

export function useEnrollmentsList(params) {
  return useQuery({
    queryKey: qk.enrollments.list(params),
    queryFn: () => fetchEnrollments(params),
    select: (res) => res.data || [],
  })
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.enrollments.all })
      toast.success('Enrollment created')
    },
  })
}
