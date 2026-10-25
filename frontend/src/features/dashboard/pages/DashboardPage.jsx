import { FiUsers, FiUserCheck, FiBriefcase, FiBookOpen, FiClipboard } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import StatCard from '@/components/common/StatCard'
import { useAuth } from '@/app/providers/AuthProvider'
import { useDashboard } from '../hooks/useDashboard'
import OverviewChart from '../components/OverviewChart'
import DistributionChart from '../components/DistributionChart'
import RecentActivity from '../components/RecentActivity'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: stats = {}, isLoading } = useDashboard()

  const cards = [
    { label: 'Students', value: stats.students, icon: FiUsers, tone: 'brand' },
    { label: 'Faculty', value: stats.faculties, icon: FiUserCheck, tone: 'teal' },
    { label: 'Departments', value: stats.departments, icon: FiBriefcase, tone: 'amber' },
    { label: 'Courses', value: stats.courses, icon: FiBookOpen, tone: 'rose' },
    { label: 'Enrollments', value: stats.enrollments, icon: FiClipboard, tone: 'brand' },
  ]

  const chartData = cards.map((c) => ({ name: c.label, value: c.value || 0 }))

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || ''}`}
        description="Here's what's happening across the university right now."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} isLoading={isLoading} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverviewChart data={chartData} isLoading={isLoading} />
        </div>
        <DistributionChart data={chartData} isLoading={isLoading} />
      </div>

      <div className="mt-5">
        <RecentActivity />
      </div>
    </div>
  )
}
