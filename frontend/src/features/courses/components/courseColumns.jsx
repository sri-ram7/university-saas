import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { Button, Badge } from '@/components/ui'
import { ROUTES } from '@/app/routes/routePaths'

export function buildCourseColumns({ isAdmin, onEdit, onDelete }) {
  return [
    { accessorKey: 'code', header: 'Code', meta: { label: 'Code' } },
    { accessorKey: 'name', header: 'Name', meta: { label: 'Name' } },
    { accessorKey: 'credits', header: 'Credits', meta: { label: 'Credits' } },
    {
      accessorKey: 'department',
      header: 'Department',
      meta: { label: 'Department' },
      cell: ({ getValue }) => (getValue()?.name ? <Badge tone="brand">{getValue().name}</Badge> : '—'),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Link to={ROUTES.courseDetail.replace(':id', row.original._id)}>
            <Button variant="ghost" size="icon" aria-label="View">
              <FiEye size={15} />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)} aria-label="Edit">
            <FiEdit2 size={15} />
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(row.original)} aria-label="Delete">
              <FiTrash2 size={15} className="text-rose-500" />
            </Button>
          )}
        </div>
      ),
    },
  ]
}
