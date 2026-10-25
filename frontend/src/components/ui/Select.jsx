import { forwardRef, useId } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { cn } from '@/utils/cn'

/**
 * Reusable select. `options` = [{ value, label }]. Pass `placeholder` for
 * an empty first option. Works uncontrolled with react-hook-form's register().
 */
const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className, id, ...props },
  ref
) {
  const autoId = useId()
  const selectId = id || autoId

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            'h-10 w-full appearance-none rounded-lg border bg-white pl-3 pr-9 text-sm text-slate-900 transition-colors',
            'dark:bg-ink-800 dark:text-slate-100',
            'border-slate-200 dark:border-ink-700 focus:border-brand-500',
            error && 'border-rose-400 focus:border-rose-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
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

export default Select
