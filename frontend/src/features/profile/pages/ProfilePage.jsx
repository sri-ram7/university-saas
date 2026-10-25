import { FiMail, FiShield, FiCalendar } from 'react-icons/fi'
import dayjs from 'dayjs'
import { useAuth } from '@/app/providers/AuthProvider'
import { Card, Avatar, Badge, Alert } from '@/components/ui'
import PageHeader from '@/components/common/PageHeader'

const ROLE_TONE = { admin: 'brand', faculty: 'teal', student: 'amber' }

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div>
      <PageHeader title="Profile" description="Your account details." />

      <Card className="max-w-xl">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} size="lg" />
          <div>
            <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              {user?.name}
            </p>
            <Badge tone={ROLE_TONE[user?.role] || 'slate'} className="mt-1 capitalize">
              {user?.role}
            </Badge>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-ink-800">
          <div className="flex items-center gap-3 text-sm">
            <FiMail className="text-slate-400" size={16} />
            <span className="text-slate-600 dark:text-slate-300">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FiShield className="text-slate-400" size={16} />
            <span className="capitalize text-slate-600 dark:text-slate-300">{user?.role} access</span>
          </div>
          {user?.createdAt && (
            <div className="flex items-center gap-3 text-sm">
              <FiCalendar className="text-slate-400" size={16} />
              <span className="text-slate-600 dark:text-slate-300">
                Member since {dayjs(user.createdAt).format('MMM D, YYYY')}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Alert tone="info" className="mt-4 max-w-xl">
        Profile editing isn&apos;t available yet — the backend doesn&apos;t expose an
        update-profile endpoint.
      </Alert>
    </div>
  )
}
