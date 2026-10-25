import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

export default function StatCard({ label, value, icon: Icon, isLoading, tone = 'brand' }) {
  const toneClasses = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300',
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  }

  return (
    <Card className="flex items-center gap-4">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl2', toneClasses[tone])}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {isLoading ? (
          <Skeleton className="mt-1.5 h-6 w-16" />
        ) : (
          <p className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {value ?? 0}
          </p>
        )}
      </div>
    </Card>
  )
}
