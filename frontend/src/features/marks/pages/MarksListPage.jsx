import { useMemo } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useAuth } from '@/app/providers/AuthProvider'
import { useMarksList } from '../hooks/useMarks'
import MarkFormModal from '../components/MarkFormModal'

export default function MarksListPage() {
  const { role } = useAuth()
  const canCreate = role === 'faculty' || role === 'admin'
  const { data = [], isLoading, isError, refetch } = useMarksList()
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
        accessorKey: 'exam',
        header: 'Exam',
        meta: { label: 'Exam' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      {
        accessorKey: 'obtainedMarks',
        header: 'Marks',
        meta: { label: 'Marks' },
        cell: ({ row }) =>
          `${row.original.obtainedMarks} / ${row.original.exam?.totalMarks ?? '—'}`,
      },
      {
        accessorKey: 'remarks',
        header: 'Remarks',
        meta: { label: 'Remarks' },
        cell: ({ getValue }) => (
          <span className="line-clamp-1 max-w-xs text-slate-500 dark:text-slate-400">
            {getValue() || '—'}
          </span>
        ),
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Marks"
        description="Per-student exam results."
        actions={
          canCreate && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              Record marks
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
        csvFilename="marks"
        emptyTitle="No marks recorded yet"
        emptyDescription="Record marks for an exam to get started."
      />

      <MarkFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
