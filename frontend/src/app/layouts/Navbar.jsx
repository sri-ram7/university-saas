import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiBell, FiLogOut, FiMoon, FiSun, FiUser, FiMenu } from 'react-icons/fi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useNotificationsList } from '@/features/notifications/hooks/useNotifications'
import { Avatar, Badge } from '@/components/ui'
import Breadcrumb from '@/components/common/Breadcrumb'
import { ROUTES } from '@/app/routes/routePaths'

dayjs.extend(relativeTime)

function useClickOutside(onOutside) {
  const ref = useRef(null)
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onOutside])
  return ref
}

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { data: notifications = [] } = useNotificationsList()
  const navigate = useNavigate()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const profileRef = useClickOutside(() => setProfileOpen(false))
  const notifRef = useClickOutside(() => setNotifOpen(false))

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.login)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-ink-800"
        >
          <FiMenu size={18} />
        </button>
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-ink-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-ink-800"
            aria-label="Notifications"
          >
            <FiBell size={17} />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl2 border border-slate-200 bg-white p-2 shadow-xl dark:border-ink-700 dark:bg-ink-900">
              <div className="flex items-center justify-between px-2 py-1.5">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Notifications
                </p>
                <Badge tone="brand">{notifications.length}</Badge>
              </div>
              <div className="scrollbar-thin max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-slate-400">
                    No notifications yet
                  </p>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <div key={n._id} className="rounded-lg px-2 py-2 hover:bg-slate-50 dark:hover:bg-ink-800">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {n.title}
                      </p>
                      <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                        {n.message}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {dayjs(n.createdAt).fromNow()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <Link
                to={ROUTES.notifications}
                onClick={() => setNotifOpen(false)}
                className="mt-1 block rounded-lg px-2 py-2 text-center text-xs font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20"
              >
                View all
              </Link>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100 dark:hover:bg-ink-800"
          >
            <Avatar name={user?.name} size="sm" />
            <span className="hidden text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
              {user?.name}
            </span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl2 border border-slate-200 bg-white p-1.5 shadow-xl dark:border-ink-700 dark:bg-ink-900">
              <div className="px-2.5 py-2">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
              <hr className="my-1 border-slate-100 dark:border-ink-800" />
              <Link
                to={ROUTES.profile}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-ink-800"
              >
                <FiUser size={15} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                <FiLogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
