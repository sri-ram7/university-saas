import { useMemo } from 'react'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Badge } from '@/components/ui'
import { formatDateTime } from '@/utils/formatDate'
import { useAuditLogsList } from '../hooks/useAudit'

const METHOD_TONE = { GET: 'brand', POST: 'green', PUT: 'amber', DELETE: 'rose' }

export default function AuditLogsPage() {
  const { data = [], isLoading, isError, refetch } = useAuditLogsList()

  const columns = useMemo(
    () => [
      {
        accessorKey: 'user',
        header: 'User',
        meta: { label: 'User' },
        cell: ({ getValue }) => getValue()?.name || getValue()?.email || '—',
      },
      { accessorKey: 'module', header: 'Module', meta: { label: 'Module' } },
      { accessorKey: 'action', header: 'Action', meta: { label: 'Action' } },
      {
        accessorKey: 'method',
        header: 'Method',
        meta: { label: 'Method' },
        cell: ({ getValue }) => <Badge tone={METHOD_TONE[getValue()] || 'slate'}>{getValue()}</Badge>,
      },
      { accessorKey: 'endpoint', header: 'Endpoint', meta: { label: 'Endpoint' } },
      { accessorKey: 'ipAddress', header: 'IP Address', meta: { label: 'IP Address' } },
      {
        accessorKey: 'createdAt',
        header: 'Time',
        meta: { label: 'Time' },
        cell: ({ getValue }) => formatDateTime(getValue()),
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader title="Audit Logs" description="System-wide activity trail, read-only." />

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        csvFilename="audit-logs"
        emptyTitle="No audit activity yet"
        emptyDescription="Actions across the system will be recorded here."
      />
    </div>
  )
}
