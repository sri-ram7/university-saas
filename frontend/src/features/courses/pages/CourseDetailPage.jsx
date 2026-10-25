import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import ErrorState from '@/components/common/ErrorState'
import { Card, Spinner, Button, Badge } from '@/components/ui'
import { useCourseDetail } from '../hooks/useCourses'

export default function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: course, isLoading, isError, refetch } = useCourseDetail(id)

  return (
    <div>
      <PageHeader
        title="Course details"
        actions={
          <Button variant="secondary" leftIcon={<FiArrowLeft size={14} />} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      {isLoading ? (
        <Spinner label="Loading course…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <Card className="max-w-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              {course.name}
            </h2>
            <Badge tone="brand">{course.code}</Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Credits</p>
              <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-200">{course.credits}</p>
            </div>
            <div>
              <p className="text-slate-400">Department</p>
              <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-200">
                {course.department?.name || '—'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
