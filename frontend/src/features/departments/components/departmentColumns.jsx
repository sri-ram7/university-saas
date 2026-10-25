import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Button } from '@/components/ui'
import { formatDate } from '@/utils/formatDate'

export function buildDepartmentColumns({ onEdit, onDelete }) {
  return [
    { accessorKey: 'name', header: 'Name', meta: { label: 'Name' } },
    { accessorKey: 'code', header: 'Code', meta: { label: 'Code' } },
    {
      accessorKey: 'description',
      header: 'Description',
      meta: { label: 'Description' },
      cell: ({ getValue }) => (
        <span className="line-clamp-1 max-w-xs text-slate-500 dark:text-slate-400">
          {getValue() || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      meta: { label: 'Created' },
      cell: ({ getValue }) => formatDate(getValue()),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)} aria-label="Edit">
            <FiEdit2 size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(row.original)} aria-label="Delete">
            <FiTrash2 size={15} className="text-rose-500" />
          </Button>
        </div>
      ),
    },
  ]
}
