import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FiBell } from 'react-icons/fi'
import Card from '@/components/ui/Card'
import { Skeleton, EmptyState, Badge } from '@/components/ui'
import { useNotificationsList } from '@/features/notifications/hooks/useNotifications'

dayjs.extend(relativeTime)

const AUDIENCE_TONE = { ALL: 'brand', STUDENT: 'amber', FACULTY: 'teal' }

export default function RecentActivity() {
  const { data: notifications = [], isLoading } = useNotificationsList()
  const recent = notifications.slice(0, 5)

  return (
    <Card>
      <p className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Recent activity
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <EmptyState icon={FiBell} title="No recent activity" description="New notifications will show up here." />
      ) : (
        <ul className="space-y-3">
          {recent.map((n) => (
            <li key={n._id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                <FiBell size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                    {n.title}
                  </p>
                  <Badge tone={AUDIENCE_TONE[n.audience] || 'slate'}>{n.audience}</Badge>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                  {n.message}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">{dayjs(n.createdAt).fromNow()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
