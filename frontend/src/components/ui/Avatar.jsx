import { cn } from '@/utils/cn'

const SIZES = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
}

const PALETTE = [
  'bg-brand-100 text-brand-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
]

function initials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return '?'
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

function hashIndex(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % PALETTE.length
  return Math.abs(h)
}

export default function Avatar({ name = '', size = 'md', className }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        SIZES[size],
        PALETTE[hashIndex(name)],
        className
      )}
      title={name}
    >
      {initials(name)}
    </div>
  )
}
