import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, ConfirmDialog } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/app/providers/AuthProvider'
import { useStudentsList, useDeleteStudent } from '../hooks/useStudents'
import { buildStudentColumns } from '../components/studentColumns'
import StudentFormModal from '../components/StudentFormModal'

export default function StudentsListPage() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  const { page, setPage, pageSize, setPageSize } = usePagination()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data = [], isLoading, isError, refetch } = useStudentsList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const formModal = useDisclosure()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const deleteMutation = useDeleteStudent()

  const columns = useMemo(
    () =>
      buildStudentColumns({
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
        title="Students"
        description="Enrolled students across every program and batch."
        actions={
          <Button
            leftIcon={<FiPlus size={15} />}
            onClick={() => {
              setEditing(null)
              formModal.open()
            }}
          >
            New student
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
        enableRowSelection={isAdmin}
        onBulkDelete={
          isAdmin
            ? (rows) => rows.forEach((r) => deleteMutation.mutate(r._id))
            : undefined
        }
        csvFilename="students"
        emptyTitle="No students yet"
        emptyDescription="Add your first student to get started."
      />

      <StudentFormModal
        isOpen={formModal.isOpen}
        onClose={() => {
          formModal.close()
          setEditing(null)
        }}
        student={editing}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete student"
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
