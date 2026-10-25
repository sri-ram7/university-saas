import { NavLink } from 'react-router-dom'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { cn } from '@/utils/cn'
import { useAuth } from '@/app/providers/AuthProvider'
import { NAV_SECTIONS } from '@/app/routes/navConfig'

export default function Sidebar({ collapsed, onToggle }) {
  const { role } = useAuth()

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 dark:border-ink-800 dark:bg-ink-900',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-4 dark:border-ink-800">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 font-display text-sm font-semibold text-white">
          UC
        </div>
        {!collapsed && (
          <span className="truncate font-display text-sm font-semibold text-slate-800 dark:text-slate-100">
            Univ. Console
          </span>
        )}
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section, idx) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(role))
          if (visibleItems.length === 0) return null
          return (
            <div key={idx} className="mb-4">
              {section.heading && !collapsed && (
                <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {section.heading}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(({ label, to, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-ink-800'
                      )
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 text-sm text-slate-500 hover:bg-slate-50 dark:border-ink-800 dark:text-slate-400 dark:hover:bg-ink-800"
      >
        {collapsed ? <FiChevronsRight size={16} /> : <FiChevronsLeft size={16} />}
        {!collapsed && 'Collapse'}
      </button>
    </aside>
  )
}
