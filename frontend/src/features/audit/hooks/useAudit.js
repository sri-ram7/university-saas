import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/queryKeys'
import { fetchAuditLogs } from '../services/auditService'

export function useAuditLogsList() {
  return useQuery({
    queryKey: qk.audit.list(),
    queryFn: fetchAuditLogs,
    select: (res) => res.data || [],
    refetchOnWindowFocus: true,
  })
}
