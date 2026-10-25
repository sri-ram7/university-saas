import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/app/providers/AuthProvider'
import { useProgramsList } from '../hooks/usePrograms'
import ProgramFormModal from '../components/ProgramFormModal'

export default function ProgramsListPage() {
  const { role } = useAuth()
  const { page, setPage, pageSize, setPageSize } = usePagination()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data = [], isLoading, isError, refetch } = useProgramsList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const formModal = useDisclosure()

  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Name', meta: { label: 'Name' } },
      { accessorKey: 'code', header: 'Code', meta: { label: 'Code' } },
      {
        accessorKey: 'duration',
        header: 'Duration',
        meta: { label: 'Duration' },
        cell: ({ getValue }) => `${getValue()} yr`,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        meta: { label: 'Department' },
        cell: ({ getValue }) => {
          const dept = getValue()
          return dept?.name ? <Badge tone="brand">{dept.name}</Badge> : '—'
        },
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Programs"
        description="Degree programs offered per department."
        actions={
          role === 'admin' && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              New program
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
        csvFilename="programs"
        emptyTitle="No programs yet"
        emptyDescription="Create your first program to get started."
      />

      <ProgramFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
