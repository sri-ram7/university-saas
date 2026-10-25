import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/app/providers/AuthProvider'
import { useSectionsList } from '../hooks/useSections'
import SectionFormModal from '../components/SectionFormModal'

export default function SectionsListPage() {
  const { role } = useAuth()
  const { page, setPage, pageSize, setPageSize } = usePagination()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data = [], isLoading, isError, refetch } = useSectionsList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const formModal = useDisclosure()

  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Name', meta: { label: 'Name' } },
      {
        accessorKey: 'department',
        header: 'Department',
        meta: { label: 'Department' },
        cell: ({ getValue }) => (getValue()?.name ? <Badge tone="brand">{getValue().name}</Badge> : '—'),
      },
      {
        accessorKey: 'semester',
        header: 'Semester',
        meta: { label: 'Semester' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      {
        accessorKey: 'faculty',
        header: 'In-charge',
        meta: { label: 'In-charge' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Sections"
        description="Class sections tied to a department and semester."
        actions={
          role === 'admin' && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              New section
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
        csvFilename="sections"
        emptyTitle="No sections yet"
        emptyDescription="Create your first section to get started."
      />

      <SectionFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
