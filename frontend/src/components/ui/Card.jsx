import { cn } from '@/utils/cn'

export default function Card({ children, className, padded = true, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl2 border border-slate-200 bg-white shadow-card dark:border-ink-700 dark:bg-ink-900',
        padded && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
