import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, ConfirmDialog } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/app/providers/AuthProvider'
import { useCoursesList, useDeleteCourse } from '../hooks/useCourses'
import { buildCourseColumns } from '../components/courseColumns'
import CourseFormModal from '../components/CourseFormModal'

export default function CoursesListPage() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  const { page, setPage, pageSize, setPageSize } = usePagination()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data = [], isLoading, isError, refetch } = useCoursesList({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const formModal = useDisclosure()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const deleteMutation = useDeleteCourse()

  const columns = useMemo(
    () =>
      buildCourseColumns({
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
        title="Courses"
        description="Course catalog across all departments."
        actions={
          <Button
            leftIcon={<FiPlus size={15} />}
            onClick={() => {
              setEditing(null)
              formModal.open()
            }}
          >
            New course
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
        csvFilename="courses"
        emptyTitle="No courses yet"
        emptyDescription="Create your first course to get started."
      />

      <CourseFormModal
        isOpen={formModal.isOpen}
        onClose={() => {
          formModal.close()
          setEditing(null)
        }}
        course={editing}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete course"
        description={`This will remove "${deleting?.name}" from the catalog.`}
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
