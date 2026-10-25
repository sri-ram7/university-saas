import { FiSearch, FiDownload, FiTrash2 } from 'react-icons/fi'
import { Input, Button } from '@/components/ui'
import ColumnVisibilityMenu from './ColumnVisibilityMenu'

export default function TableToolbar({
  table,
  searchValue,
  onSearchChange,
  onExport,
  selectedCount = 0,
  onBulkDelete,
  toolbarActions,
}) {
  if (selectedCount > 0) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-brand-50 px-3.5 py-2.5 dark:bg-brand-900/20">
        <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
          {selectedCount} row{selectedCount > 1 ? 's' : ''} selected
        </p>
        {onBulkDelete && (
          <Button size="sm" variant="danger" leftIcon={<FiTrash2 size={14} />} onClick={onBulkDelete}>
            Delete selected
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full max-w-xs">
        <Input
          placeholder="Search…"
          leftIcon={<FiSearch size={15} />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        {toolbarActions}
        <ColumnVisibilityMenu table={table} />
        {onExport && (
          <Button variant="secondary" size="sm" leftIcon={<FiDownload size={14} />} onClick={onExport}>
            Export CSV
          </Button>
        )}
      </div>
    </div>
  )
}
