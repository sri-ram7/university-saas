import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/queryKeys'
import { fetchDashboard } from '../services/dashboardService'

export function useDashboard() {
  return useQuery({
    queryKey: qk.dashboard(),
    queryFn: fetchDashboard,
    select: (res) => res.data || {},
  })
}
