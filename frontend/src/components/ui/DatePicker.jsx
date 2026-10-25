import { forwardRef, useId } from 'react'
import { FiCalendar } from 'react-icons/fi'
import { cn } from '@/utils/cn'

/**
 * Date input built on the native <input type="date"> so no extra dependency
 * is needed. Value/onChange are plain 'YYYY-MM-DD' strings, which is exactly
 * what the backend's Date fields accept via JSON.
 */
const DatePicker = forwardRef(function DatePicker(
  { label, error, hint, className, id, ...props },
  ref
) {
  const autoId = useId()
  const inputId = id || autoId

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type="date"
          aria-invalid={!!error}
          className={cn(
            'h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-slate-900 transition-colors',
            'dark:bg-ink-800 dark:text-slate-100 [color-scheme:light] dark:[color-scheme:dark]',
            'border-slate-200 dark:border-ink-700 focus:border-brand-500',
            error && 'border-rose-400 focus:border-rose-500',
            className
          )}
          {...props}
        />
        <FiCalendar
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
})

export default DatePicker
