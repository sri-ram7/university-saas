import { useMemo } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useAuth } from '@/app/providers/AuthProvider'
import { useResultsList } from '../hooks/useResults'
import GenerateResultModal from '../components/GenerateResultModal'

export default function ResultsListPage() {
  const { role } = useAuth()
  const { data = [], isLoading, isError, refetch } = useResultsList()
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
        accessorKey: 'semester',
        header: 'Semester',
        meta: { label: 'Semester' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      { accessorKey: 'sgpa', header: 'SGPA', meta: { label: 'SGPA' } },
      { accessorKey: 'cgpa', header: 'CGPA', meta: { label: 'CGPA' } },
      {
        accessorKey: 'earnedCredits',
        header: 'Credits',
        meta: { label: 'Credits' },
        cell: ({ row }) => `${row.original.earnedCredits} / ${row.original.totalCredits}`,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { label: 'Status' },
        cell: ({ getValue }) => (
          <Badge tone={getValue() === 'PASS' ? 'green' : 'rose'}>{getValue()}</Badge>
        ),
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Results"
        description="Generated semester results with SGPA and CGPA."
        actions={
          role === 'admin' && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              Generate result
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
        csvFilename="results"
        emptyTitle="No results generated yet"
        emptyDescription="Generate a result for a student's semester to get started."
      />

      <GenerateResultModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
