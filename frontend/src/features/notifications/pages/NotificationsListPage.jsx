import { useMemo } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useAuth } from '@/app/providers/AuthProvider'
import { formatDateTime } from '@/utils/formatDate'
import { useNotificationsList } from '../hooks/useNotifications'
import { AUDIENCE_TONE } from '../constants/notificationConstants'
import NotificationFormModal from '../components/NotificationFormModal'

export default function NotificationsListPage() {
  const { role } = useAuth()
  const { data = [], isLoading, isError, refetch } = useNotificationsList()
  const formModal = useDisclosure()

  const columns = useMemo(
    () => [
      { accessorKey: 'title', header: 'Title', meta: { label: 'Title' } },
      {
        accessorKey: 'message',
        header: 'Message',
        meta: { label: 'Message' },
        cell: ({ getValue }) => (
          <span className="line-clamp-1 max-w-sm text-slate-500 dark:text-slate-400">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'audience',
        header: 'Audience',
        meta: { label: 'Audience' },
        cell: ({ getValue }) => <Badge tone={AUDIENCE_TONE[getValue()]}>{getValue()}</Badge>,
      },
      {
        accessorKey: 'createdAt',
        header: 'Sent',
        meta: { label: 'Sent' },
        cell: ({ getValue }) => formatDateTime(getValue()),
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Announcements broadcast to students and faculty."
        actions={
          role === 'admin' && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              New notification
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        csvFilename="notifications"
        emptyTitle="No notifications yet"
        emptyDescription="Send your first announcement to get started."
      />

      <NotificationFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
