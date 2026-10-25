import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiMail, FiBriefcase, FiLayers, FiHash } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import ErrorState from '@/components/common/ErrorState'
import { Card, Spinner, Button, Avatar, Badge } from '@/components/ui'
import { useStudentDetail } from '../hooks/useStudents'

export default function StudentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: student, isLoading, isError, refetch } = useStudentDetail(id)

  return (
    <div>
      <PageHeader
        title="Student details"
        actions={
          <Button variant="secondary" leftIcon={<FiArrowLeft size={14} />} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      {isLoading ? (
        <Spinner label="Loading student…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <Card className="max-w-xl">
          <div className="flex items-center gap-4">
            <Avatar name={student.name} size="lg" />
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                {student.name}
              </h2>
              <Badge tone="brand">{student.program?.name || 'No program'}</Badge>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-ink-800">
            <div className="flex items-center gap-3 text-sm">
              <FiMail className="text-slate-400" size={16} />
              <span className="text-slate-600 dark:text-slate-300">{student.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiBriefcase className="text-slate-400" size={16} />
              <span className="text-slate-600 dark:text-slate-300">
                {student.department?.name || 'No department'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiLayers className="text-slate-400" size={16} />
              <span className="text-slate-600 dark:text-slate-300">
                {student.batch?.name || 'No batch'}
              </span>
            </div>
            {student.advisor?.name && (
              <div className="flex items-center gap-3 text-sm">
                <FiHash className="text-slate-400" size={16} />
                <span className="text-slate-600 dark:text-slate-300">
                  Advisor: {student.advisor.name}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
