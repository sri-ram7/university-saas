import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, ConfirmDialog } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/app/providers/AuthProvider'
import { useFacultyList, useDeleteFaculty } from '../hooks/useFaculty'
import { buildFacultyColumns } from '../components/facultyColumns'
import FacultyFormModal from '../components/FacultyFormModal'

export default function FacultyListPage() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  const { page, setPage, pageSize, setPageSize } = usePagination()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data = [], isLoading, isError, refetch } = useFacultyList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const formModal = useDisclosure()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const deleteMutation = useDeleteFaculty()

  const columns = useMemo(
    () =>
      buildFacultyColumns({
        isAdmin,
        onEdit: (row) => {
          setEditing(row)
          formModal.open()
        },
        onDelete: (row) => setDeleting(row),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAdmin]
  )

  return (
    <div>
      <PageHeader
        title="Faculty"
        description="Teaching staff across every department."
        actions={
          <Button
            leftIcon={<FiPlus size={15} />}
            onClick={() => {
              setEditing(null)
              formModal.open()
            }}
          >
            New faculty
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
        csvFilename="faculty"
        emptyTitle="No faculty members yet"
        emptyDescription="Add your first faculty member to get started."
      />

      <FacultyFormModal
        isOpen={formModal.isOpen}
        onClose={() => {
          formModal.close()
          setEditing(null)
        }}
        faculty={editing}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete faculty member"
        description={`This will remove "${deleting?.name}" from active records.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={() =>
          deleteMutation.mutate(deleting._id, { onSuccess: () => setDeleting(null) })
        }
      />
    </div>
  )
}
