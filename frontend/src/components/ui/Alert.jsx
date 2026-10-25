import { FiAlertTriangle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi'
import { cn } from '@/utils/cn'

const TONES = {
  info: {
    wrap: 'bg-brand-50 text-brand-800 border-brand-100 dark:bg-brand-900/20 dark:text-brand-200 dark:border-brand-900',
    Icon: FiInfo,
  },
  success: {
    wrap: 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-900',
    Icon: FiCheckCircle,
  },
  warning: {
    wrap: 'bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-900',
    Icon: FiAlertTriangle,
  },
  error: {
    wrap: 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-900/20 dark:text-rose-200 dark:border-rose-900',
    Icon: FiXCircle,
  },
}

export default function Alert({ tone = 'info', title, children, className }) {
  const { wrap, Icon } = TONES[tone] || TONES.info
  return (
    <div className={cn('flex gap-2.5 rounded-lg border px-3.5 py-3 text-sm', wrap, className)}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        {children && <div className="text-[13px] opacity-90">{children}</div>}
      </div>
    </div>
  )
}
