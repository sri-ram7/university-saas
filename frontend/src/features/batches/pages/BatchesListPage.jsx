import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/app/providers/AuthProvider'
import { useBatchesList } from '../hooks/useBatches'
import BatchFormModal from '../components/BatchFormModal'

export default function BatchesListPage() {
  const { role } = useAuth()
  const { page, setPage, pageSize, setPageSize } = usePagination()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data = [], isLoading, isError, refetch } = useBatchesList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const formModal = useDisclosure()

  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Name', meta: { label: 'Name' } },
      {
        accessorKey: 'startYear',
        header: 'Years',
        meta: { label: 'Years' },
        cell: ({ row }) => `${row.original.startYear} – ${row.original.endYear}`,
      },
      {
        accessorKey: 'program',
        header: 'Program',
        meta: { label: 'Program' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { label: 'Status' },
        cell: ({ getValue }) => (
          <Badge tone={getValue() === 'ACTIVE' ? 'green' : 'slate'}>{getValue()}</Badge>
        ),
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Batches"
        description="Student intake batches per program."
        actions={
          role === 'admin' && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              New batch
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
        csvFilename="batches"
        emptyTitle="No batches yet"
        emptyDescription="Create your first batch to get started."
      />

      <BatchFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
