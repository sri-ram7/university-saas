import { useMemo } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useAuth } from '@/app/providers/AuthProvider'
import { formatDate } from '@/utils/formatDate'
import { useExamsList } from '../hooks/useExams'
import ExamFormModal from '../components/ExamFormModal'

export default function ExamsListPage() {
  const { role } = useAuth()
  const canCreate = role === 'admin' || role === 'faculty'
  const { data = [], isLoading, isError, refetch } = useExamsList()
  const formModal = useDisclosure()

  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Name', meta: { label: 'Name' } },
      {
        accessorKey: 'type',
        header: 'Type',
        meta: { label: 'Type' },
        cell: ({ getValue }) => <Badge tone="brand">{getValue()}</Badge>,
      },
      {
        accessorKey: 'courseOffering',
        header: 'Course',
        meta: { label: 'Course' },
        cell: ({ getValue }) => getValue()?.course?.code || '—',
      },
      {
        accessorKey: 'examDate',
        header: 'Date',
        meta: { label: 'Date' },
        cell: ({ getValue }) => formatDate(getValue()),
      },
      {
        accessorKey: 'totalMarks',
        header: 'Marks',
        meta: { label: 'Marks' },
        cell: ({ row }) => `${row.original.passingMarks} / ${row.original.totalMarks}`,
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Exams"
        description="Scheduled exams per course offering."
        actions={
          canCreate && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              New exam
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
        csvFilename="exams"
        emptyTitle="No exams yet"
        emptyDescription="Schedule your first exam to get started."
      />

      <ExamFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
