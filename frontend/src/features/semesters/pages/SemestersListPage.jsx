import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/app/providers/AuthProvider'
import { formatDate } from '@/utils/formatDate'
import { useSemestersList } from '../hooks/useSemesters'
import { SEMESTER_STATUS_TONE } from '../constants/semesterConstants'
import SemesterFormModal from '../components/SemesterFormModal'

export default function SemestersListPage() {
  const { role } = useAuth()
  const { page, setPage, pageSize, setPageSize } = usePagination()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data = [], isLoading, isError, refetch } = useSemestersList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const formModal = useDisclosure()

  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Name', meta: { label: 'Name' } },
      { accessorKey: 'number', header: '#', meta: { label: 'Number' } },
      { accessorKey: 'academicYear', header: 'Academic Year', meta: { label: 'Academic Year' } },
      {
        accessorKey: 'startDate',
        header: 'Dates',
        meta: { label: 'Dates' },
        cell: ({ row }) => `${formatDate(row.original.startDate)} – ${formatDate(row.original.endDate)}`,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { label: 'Status' },
        cell: ({ getValue }) => <Badge tone={SEMESTER_STATUS_TONE[getValue()]}>{getValue()}</Badge>,
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Semesters"
        description="Academic semesters and their term dates."
        actions={
          role === 'admin' && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              New semester
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
        csvFilename="semesters"
        emptyTitle="No semesters yet"
        emptyDescription="Create your first semester to get started."
      />

      <SemesterFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
