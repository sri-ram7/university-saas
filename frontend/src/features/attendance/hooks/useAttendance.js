import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchAttendance, createAttendance } from '../services/attendanceService'

export function useAttendanceList() {
  return useQuery({
    queryKey: qk.attendance.list(),
    queryFn: fetchAttendance,
    select: (res) => res.data || [],
  })
}

export function useCreateAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.attendance.all })
      toast.success('Attendance recorded')
    },
  })
}
