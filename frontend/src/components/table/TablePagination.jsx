import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button } from '@/components/ui'

/**
 * Backend list endpoints don't return a total/count, so we can't render
 * "Page X of Y". Instead: Prev is enabled once page > 1, Next is enabled
 * as long as the last fetched page came back full (== pageSize rows),
 * which is the only signal available that more data might exist.
 */
export default function TablePagination({ page, pageSize, rowCount, onPageChange, onPageSizeChange }) {
  const hasNext = rowCount === pageSize
  const hasPrev = page > 1

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-ink-800">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">Page {page}</span>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          leftIcon={<FiChevronLeft size={14} />}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          rightIcon={<FiChevronRight size={14} />}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
