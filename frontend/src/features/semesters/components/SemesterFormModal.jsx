import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select, DatePicker } from '@/components/ui'
import { semesterSchema } from '../schemas/semesterSchemas'
import { SEMESTER_STATUS_OPTIONS } from '../constants/semesterConstants'
import { useCreateSemester } from '../hooks/useSemesters'

export default function SemesterFormModal({ isOpen, onClose }) {
  const createMutation = useCreateSemester()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: '',
      number: '',
      academicYear: '',
      startDate: '',
      endDate: '',
      status: 'UPCOMING',
    },
  })

  const onSubmit = (values) => {
    createMutation.mutateAsync(values).then(() => {
      reset()
      onClose()
    }).catch(() => {})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New semester"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Create semester
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="Fall 2025" error={errors.name?.message} {...register('name')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Number (1-8)" type="number" min={1} max={8} error={errors.number?.message} {...register('number')} />
          <Input label="Academic year" placeholder="2025-2026" error={errors.academicYear?.message} {...register('academicYear')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <DatePicker label="Start date" error={errors.startDate?.message} {...register('startDate')} />
          <DatePicker label="End date" error={errors.endDate?.message} {...register('endDate')} />
        </div>
        <Select label="Status" options={SEMESTER_STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
      </form>
    </Modal>
  )
}
