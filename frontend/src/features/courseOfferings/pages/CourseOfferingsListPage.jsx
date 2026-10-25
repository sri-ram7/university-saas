import { useMemo } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useAuth } from '@/app/providers/AuthProvider'
import { useCourseOfferingsList } from '../hooks/useCourseOfferings'
import CourseOfferingFormModal from '../components/CourseOfferingFormModal'

export default function CourseOfferingsListPage() {
  const { role } = useAuth()
  const { data = [], isLoading, isError, refetch } = useCourseOfferingsList()
  const formModal = useDisclosure()

  const columns = useMemo(
    () => [
      {
        accessorKey: 'course',
        header: 'Course',
        meta: { label: 'Course' },
        cell: ({ getValue }) => (getValue()?.code ? <Badge tone="brand">{getValue().code}</Badge> : '—'),
      },
      {
        accessorKey: 'faculty',
        header: 'Faculty',
        meta: { label: 'Faculty' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      {
        accessorKey: 'semester',
        header: 'Semester',
        meta: { label: 'Semester' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      {
        accessorKey: 'section',
        header: 'Section',
        meta: { label: 'Section' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      {
        accessorKey: 'batch',
        header: 'Batch',
        meta: { label: 'Batch' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Course Offerings"
        description="Which course is taught, by whom, to which section."
        actions={
          role === 'admin' && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              New offering
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        csvFilename="course-offerings"
        emptyTitle="No course offerings yet"
        emptyDescription="Create your first course offering to get started."
      />

      <CourseOfferingFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
