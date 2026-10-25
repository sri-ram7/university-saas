import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import ErrorState from '@/components/common/ErrorState'
import { Card, Spinner, Button, Badge } from '@/components/ui'
import { formatDateTime } from '@/utils/formatDate'
import { useDepartmentDetail } from '../hooks/useDepartments'

export default function DepartmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: department, isLoading, isError, refetch } = useDepartmentDetail(id)

  return (
    <div>
      <PageHeader
        title="Department details"
        actions={
          <Button variant="secondary" leftIcon={<FiArrowLeft size={14} />} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      {isLoading ? (
        <Spinner label="Loading department…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <Card className="max-w-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              {department.name}
            </h2>
            <Badge tone="brand">{department.code}</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {department.description || 'No description provided.'}
          </p>
          <p className="mt-4 text-xs text-slate-400">
            Created {formatDateTime(department.createdAt)} · Updated{' '}
            {formatDateTime(department.updatedAt)}
          </p>
        </Card>
      )}
    </div>
  )
}
