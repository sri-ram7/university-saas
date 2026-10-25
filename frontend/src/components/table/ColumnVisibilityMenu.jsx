import { useState, useRef, useEffect } from 'react'
import { FiColumns } from 'react-icons/fi'
import { cn } from '@/utils/cn'

export default function ColumnVisibilityMenu({ table }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const columns = table.getAllLeafColumns().filter((c) => c.getCanHide())

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50',
          'dark:border-ink-700 dark:text-slate-300 dark:hover:bg-ink-800'
        )}
      >
        <FiColumns size={15} /> Columns
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl2 border border-slate-200 bg-white p-2 shadow-xl dark:border-ink-700 dark:bg-ink-900">
          {columns.map((column) => (
            <label
              key={column.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-ink-800"
            >
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              {column.columnDef.meta?.label || column.id}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
