import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { Button, Badge, Avatar } from '@/components/ui'
import { ROUTES } from '@/app/routes/routePaths'

export function buildStudentColumns({ isAdmin, onEdit, onDelete }) {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { label: 'Name' },
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.original.name} size="sm" />
          <span className="font-medium text-slate-800 dark:text-slate-100">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: 'email', header: 'Email', meta: { label: 'Email' } },
    {
      accessorKey: 'program',
      header: 'Program',
      meta: { label: 'Program' },
      cell: ({ getValue }) => getValue()?.name || '—',
    },
    {
      accessorKey: 'batch',
      header: 'Batch',
      meta: { label: 'Batch' },
      cell: ({ getValue }) => getValue()?.name || '—',
    },
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
          <Link to={ROUTES.studentDetail.replace(':id', row.original._id)}>
            <Button variant="ghost" size="icon" aria-label="View">
              <FiEye size={15} />
            </Button>
          </Link>
          {isAdmin && (
            <>
              <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)} aria-label="Edit">
                <FiEdit2 size={15} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(row.original)} aria-label="Delete">
                <FiTrash2 size={15} className="text-rose-500" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]
}
