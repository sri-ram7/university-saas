import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select } from '@/components/ui'
import { programSchema } from '../schemas/programSchemas'
import { useCreateProgram } from '../hooks/usePrograms'
import { useDepartmentOptions } from '@/features/departments/hooks/useDepartments'

export default function ProgramFormModal({ isOpen, onClose }) {
  const createMutation = useCreateProgram()
  const { options: departmentOptions } = useDepartmentOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(programSchema),
    defaultValues: { name: '', code: '', duration: '', department: '' },
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
      title="New program"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Create program
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="B.Tech Computer Science" error={errors.name?.message} {...register('name')} />
        <Input label="Code" placeholder="BTCS" error={errors.code?.message} {...register('code')} />
        <Input
          label="Duration (years)"
          type="number"
          min={1}
          error={errors.duration?.message}
          {...register('duration')}
        />
        <Select
          label="Department"
          placeholder="Select department"
          options={departmentOptions}
          error={errors.department?.message}
          {...register('department')}
        />
      </form>
    </Modal>
  )
}
