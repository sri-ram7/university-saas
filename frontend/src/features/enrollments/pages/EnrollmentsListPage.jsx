import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useEnrollmentsList } from '../hooks/useEnrollments'
import { ENROLLMENT_STATUS_TONE } from '../constants/enrollmentConstants'
import EnrollmentFormModal from '../components/EnrollmentFormModal'

export default function EnrollmentsListPage() {
  const { page, setPage, pageSize, setPageSize } = usePagination()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data = [], isLoading, isError, refetch } = useEnrollmentsList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const formModal = useDisclosure()

  const columns = useMemo(
    () => [
      {
        accessorKey: 'student',
        header: 'Student',
        meta: { label: 'Student' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      {
        accessorKey: 'academicYear',
        header: 'Academic Year',
        meta: { label: 'Academic Year' },
      },
      { accessorKey: 'semester', header: 'Semester', meta: { label: 'Semester' } },
      {
        accessorKey: 'grade',
        header: 'Grade',
        meta: { label: 'Grade' },
        cell: ({ getValue }) => getValue() || '—',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { label: 'Status' },
        cell: ({ getValue }) => <Badge tone={ENROLLMENT_STATUS_TONE[getValue()]}>{getValue()}</Badge>,
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Enrollments"
        description="Which students are enrolled in which offerings."
        actions={
          <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
            New enrollment
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        manual
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        csvFilename="enrollments"
        emptyTitle="No enrollments yet"
        emptyDescription="Create your first enrollment to get started."
      />

      <EnrollmentFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
