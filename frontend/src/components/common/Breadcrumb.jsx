import { Link, useLocation } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

function toLabel(segment) {
  if (/^[a-f0-9]{24}$/i.test(segment)) return 'Detail'
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      <Link to="/dashboard" className="hover:text-slate-700 dark:hover:text-slate-200">
        Home
      </Link>
      {segments.map((seg, idx) => {
        const path = '/' + segments.slice(0, idx + 1).join('/')
        const isLast = idx === segments.length - 1
        return (
          <span key={path} className="flex items-center gap-1.5">
            <FiChevronRight size={13} />
            {isLast ? (
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {toLabel(seg)}
              </span>
            ) : (
              <Link to={path} className="hover:text-slate-700 dark:hover:text-slate-200">
                {toLabel(seg)}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
