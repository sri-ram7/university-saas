import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchExams, createExam } from '../services/examService'

export function useExamsList() {
  return useQuery({
    queryKey: qk.exams.list(),
    queryFn: fetchExams,
    select: (res) => res.data || [],
  })
}

export function useExamOptions() {
  const { data = [], ...rest } = useExamsList()
  return { options: data.map((e) => ({ value: e._id, label: e.name })), data, ...rest }
}

export function useCreateExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.exams.all })
      toast.success('Exam created')
    },
  })
}
