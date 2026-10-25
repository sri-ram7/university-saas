import { useMemo } from 'react'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { DataTable } from '@/components/table'
import { Button, Badge } from '@/components/ui'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useAuth } from '@/app/providers/AuthProvider'
import { formatDate } from '@/utils/formatDate'
import { useAttendanceList } from '../hooks/useAttendance'
import { ATTENDANCE_STATUS_TONE } from '../constants/attendanceConstants'
import AttendanceFormModal from '../components/AttendanceFormModal'

export default function AttendanceListPage() {
  const { role } = useAuth()
  const canCreate = role === 'faculty' || role === 'admin'
  const { data = [], isLoading, isError, refetch } = useAttendanceList()
  const formModal = useDisclosure()

  const columns = useMemo(
    () => [
      {
        accessorKey: 'student',
        header: 'Student',
        meta: { label: 'Student' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      {
        accessorKey: 'course',
        header: 'Course',
        meta: { label: 'Course' },
        cell: ({ getValue }) => (getValue()?.code ? <Badge tone="brand">{getValue().code}</Badge> : '—'),
      },
      {
        accessorKey: 'faculty',
        header: 'Faculty',
        meta: { label: 'Faculty' },
        cell: ({ getValue }) => getValue()?.name || '—',
      },
      {
        accessorKey: 'date',
        header: 'Date',
        meta: { label: 'Date' },
        cell: ({ getValue }) => formatDate(getValue()),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { label: 'Status' },
        cell: ({ getValue }) => <Badge tone={ATTENDANCE_STATUS_TONE[getValue()]}>{getValue()}</Badge>,
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Daily attendance records per course."
        actions={
          canCreate && (
            <Button leftIcon={<FiPlus size={15} />} onClick={formModal.open}>
              Record attendance
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
        csvFilename="attendance"
        emptyTitle="No attendance records yet"
        emptyDescription="Record attendance for a class to get started."
      />

      <AttendanceFormModal isOpen={formModal.isOpen} onClose={formModal.close} />
    </div>
  )
}
