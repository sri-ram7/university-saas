import { cn } from '@/utils/cn'

export default function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-ink-700',
        className
      )}
    />
  )
}

export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="w-full">
      <Skeleton className="mb-3 h-9 w-full" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-3">
            {Array.from({ length: cols }).map((__, c) => (
              <Skeleton key={c} className="h-9 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
