import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import ErrorState from '@/components/common/ErrorState'
import { Card, Spinner, Button, Avatar, Badge } from '@/components/ui'
import { useFacultyDetail } from '../hooks/useFaculty'

export default function FacultyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: faculty, isLoading, isError, refetch } = useFacultyDetail(id)

  return (
    <div>
      <PageHeader
        title="Faculty details"
        actions={
          <Button variant="secondary" leftIcon={<FiArrowLeft size={14} />} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      {isLoading ? (
        <Spinner label="Loading faculty member…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <Card className="max-w-xl">
          <div className="flex items-center gap-4">
            <Avatar name={faculty.name} size="lg" />
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                {faculty.name}
              </h2>
              <Badge tone="teal">{faculty.designation}</Badge>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-ink-800">
            <div className="flex items-center gap-3 text-sm">
              <FiMail className="text-slate-400" size={16} />
              <span className="text-slate-600 dark:text-slate-300">{faculty.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiPhone className="text-slate-400" size={16} />
              <span className="text-slate-600 dark:text-slate-300">{faculty.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiBriefcase className="text-slate-400" size={16} />
              <span className="text-slate-600 dark:text-slate-300">
                {faculty.department?.name || 'No department'}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
