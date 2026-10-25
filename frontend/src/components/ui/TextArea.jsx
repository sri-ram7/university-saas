import { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

const TextArea = forwardRef(function TextArea(
  { label, error, hint, rows = 4, className, id, ...props },
  ref
) {
  const autoId = useId()
  const areaId = id || autoId

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={areaId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        aria-invalid={!!error}
        className={cn(
          'w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors',
          'dark:bg-ink-800 dark:text-slate-100 dark:placeholder:text-slate-500',
          'border-slate-200 dark:border-ink-700 focus:border-brand-500',
          error && 'border-rose-400 focus:border-rose-500',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
})

export default TextArea
