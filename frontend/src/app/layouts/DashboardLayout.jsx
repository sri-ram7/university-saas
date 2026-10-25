import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-ink-950">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setCollapsed((c) => !c)} />
        <main className="flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
