import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, ConfirmDialog } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/app/providers/AuthProvider'
import { useDepartmentsList, useDeleteDepartment } from '../hooks/useDepartments'
import { buildDepartmentColumns } from '../components/departmentColumns'
import DepartmentFormModal from '../components/DepartmentFormModal'

export default function DepartmentsListPage() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  const { page, setPage, pageSize, setPageSize } = usePagination()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data = [], isLoading, isError, refetch } = useDepartmentsList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const formModal = useDisclosure()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const deleteMutation = useDeleteDepartment()

  const columns = useMemo(
    () =>
      buildDepartmentColumns({
        onEdit: (row) => {
          setEditing(row)
          formModal.open()
        },
        onDelete: (row) => setDeleting(row),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const visibleColumns = isAdmin ? columns : columns.filter((c) => c.id !== 'actions')

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Academic departments across the university."
        actions={
          <Button
            leftIcon={<FiPlus size={15} />}
            onClick={() => {
              setEditing(null)
              formModal.open()
            }}
          >
            New department
          </Button>
        }
      />

      <DataTable
        columns={visibleColumns}
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
        csvFilename="departments"
        emptyTitle="No departments yet"
        emptyDescription="Create your first department to get started."
      />

      <DepartmentFormModal
        isOpen={formModal.isOpen}
        onClose={() => {
          formModal.close()
          setEditing(null)
        }}
        department={editing}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete department"
        description={`This will remove "${deleting?.name}". This action can be reversed only by an administrator restoring the record directly.`}
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
