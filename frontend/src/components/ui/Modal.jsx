import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import { cn } from '@/utils/cn'

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
}) {
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full rounded-xl2 bg-white shadow-xl dark:bg-ink-900 dark:border dark:border-ink-700',
          'max-h-[85vh] flex flex-col',
          SIZES[size]
        )}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 dark:border-ink-800">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-ink-800"
            aria-label="Close dialog"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="scrollbar-thin overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3 dark:border-ink-800">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
