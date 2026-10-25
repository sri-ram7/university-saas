import { FiLoader } from 'react-icons/fi'
import { cn } from '@/utils/cn'

const SIZES = { sm: 14, md: 20, lg: 28 }

export default function Spinner({ size = 'md', className, label }) {
  return (
    <div className={cn('flex items-center justify-center gap-2 text-slate-400', className)}>
      <FiLoader className="animate-spin" size={SIZES[size] || 20} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}
