import { FiInbox } from 'react-icons/fi'
import Button from './Button'

export default function EmptyState({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-ink-800">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
