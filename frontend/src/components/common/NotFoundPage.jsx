import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Button } from '@/components/ui'
import { ROUTES } from '@/app/routes/routePaths'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-center dark:bg-ink-950">
      <p className="font-display text-6xl font-bold text-brand-600">404</p>
      <h1 className="font-display text-xl font-semibold text-slate-800 dark:text-slate-100">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link to={ROUTES.dashboard}>
        <Button leftIcon={<FiArrowLeft size={14} />} className="mt-2">
          Back to dashboard
        </Button>
      </Link>
    </div>
  )
}
