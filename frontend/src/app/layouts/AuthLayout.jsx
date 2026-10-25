import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 font-display text-sm font-semibold">
            UC
          </div>
          <span className="font-display text-lg font-semibold">Univ. Console</span>
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold leading-tight">
            One console for the whole academic record.
          </h1>
          <p className="mt-3 max-w-md text-sm text-brand-100">
            Students, faculty, courses, attendance, and results — kept in one
            place, backed by a single source of truth.
          </p>
        </div>
        <p className="text-xs text-brand-200">© {new Date().getFullYear()} University Management System</p>
      </div>
      <div className="flex w-full flex-1 items-center justify-center bg-slate-50 p-6 dark:bg-ink-950 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
