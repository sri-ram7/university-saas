import { FiAlertOctagon } from 'react-icons/fi'
import Button from '@/components/ui/Button'

export default function ErrorState({
  title = 'Could not load data',
  description = 'Something went wrong while talking to the server.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-900/20">
        <FiAlertOctagon size={22} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
