import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { TbSelector } from 'react-icons/tb'
import { SkeletonTable, EmptyState } from '@/components/ui'
import ErrorState from '@/components/common/ErrorState'
import TableToolbar from './TableToolbar'
import TablePagination from './TablePagination'
import { exportToCsv } from './exportToCsv'

const SELECT_COL_ID = '__select'

/**
 * Generic CRUD table used across every feature.
 *
 * Server-driven mode (manual=true): parent owns search + pagination, passes
 *   page/pageSize/onPageChange/onPageSizeChange/searchValue/onSearchChange.
 *   Used for resources whose backend list route supports query params.
 *
 * Client-driven mode (manual=false, default): table paginates/filters the
 *   full array it was given in-browser. Used for resources whose backend
 *   list route ignores query params (no server search/pagination exists).
 */
export default function DataTable({
  columns,
  data = [],
  isLoading = false,
  isError = false,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription = 'Once records are created, they will show up here.',
  csvFilename,
  enableRowSelection = false,
  onBulkDelete,
  toolbarActions,
  manual = false,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  searchValue = '',
  onSearchChange,
}) {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [internalPagination, setInternalPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const tableColumns = useMemo(() => {
    if (!enableRowSelection) return columns
    return [
      {
        id: SELECT_COL_ID,
        enableHiding: false,
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      ...columns,
    ]
  }, [columns, enableRowSelection])

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter: manual ? undefined : globalFilter,
      rowSelection,
      pagination: manual
        ? { pageIndex: page - 1, pageSize }
        : internalPagination,
    },
    getRowId: (row) => row._id || row.id,
    onSortingChange: setSorting,
    onGlobalFilterChange: manual ? undefined : setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: manual ? undefined : setInternalPagination,
    manualPagination: manual,
    manualFiltering: manual,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: manual ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manual ? undefined : getPaginationRowModel(),
  })

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original)

  const handleExport = () => {
    if (!csvFilename) return
    const exportCols = columns
      .filter((c) => c.id !== 'actions' && c.accessorKey)
      .map((c) => ({
        label: c.meta?.label || c.header || c.accessorKey,
        accessor: (row) => row[c.accessorKey],
      }))
    exportToCsv(csvFilename, exportCols, table.getFilteredRowModel().rows.map((r) => r.original))
  }

  if (isLoading) return <SkeletonTable />
  if (isError) return <ErrorState onRetry={onRetry} />

  return (
    <div className="space-y-3">
      <TableToolbar
        table={table}
        searchValue={manual ? searchValue : globalFilter}
        onSearchChange={manual ? onSearchChange : setGlobalFilter}
        onExport={csvFilename ? handleExport : undefined}
        selectedCount={selectedRows.length}
        onBulkDelete={onBulkDelete ? () => onBulkDelete(selectedRows) : undefined}
        toolbarActions={toolbarActions}
      />

      {data.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="scrollbar-thin overflow-x-auto rounded-xl2 border border-slate-200 dark:border-ink-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-ink-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          disabled={!header.column.getCanSort()}
                          className="flex items-center gap-1 disabled:cursor-default"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() &&
                            ({
                              asc: <FiChevronUp size={13} />,
                              desc: <FiChevronDown size={13} />,
                            }[header.column.getIsSorted()] || (
                              <TbSelector size={13} className="opacity-40" />
                            ))}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-ink-800">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-ink-800/60">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TablePagination
        page={manual ? page : internalPagination.pageIndex + 1}
        pageSize={manual ? pageSize : internalPagination.pageSize}
        rowCount={manual ? data.length : table.getRowModel().rows.length}
        onPageChange={manual ? onPageChange : (p) => setInternalPagination((s) => ({ ...s, pageIndex: p - 1 }))}
        onPageSizeChange={
          manual
            ? onPageSizeChange
            : (size) => setInternalPagination({ pageIndex: 0, pageSize: size })
        }
      />
    </div>
  )
}
