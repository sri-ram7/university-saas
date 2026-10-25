import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { qk } from '@/lib/queryKeys'
import { fetchNotifications, createNotification } from '../services/notificationService'

export function useNotificationsList() {
  return useQuery({
    queryKey: qk.notifications.list(),
    queryFn: fetchNotifications,
    select: (res) => res.data || [],
    refetchOnWindowFocus: true,
  })
}

export function useCreateNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.notifications.all })
      toast.success('Notification sent')
    },
  })
}
