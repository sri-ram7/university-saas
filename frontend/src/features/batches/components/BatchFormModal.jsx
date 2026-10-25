import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select } from '@/components/ui'
import { batchSchema } from '../schemas/batchSchemas'
import { BATCH_STATUS_OPTIONS } from '../constants/batchConstants'
import { useCreateBatch } from '../hooks/useBatches'
import { useProgramOptions } from '@/features/programs/hooks/usePrograms'

export default function BatchFormModal({ isOpen, onClose }) {
  const createMutation = useCreateBatch()
  const { options: programOptions } = useProgramOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: { name: '', startYear: '', endYear: '', program: '', status: 'ACTIVE' },
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
      title="New batch"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Create batch
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="2025-2029" error={errors.name?.message} {...register('name')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Start year" type="number" error={errors.startYear?.message} {...register('startYear')} />
          <Input label="End year" type="number" error={errors.endYear?.message} {...register('endYear')} />
        </div>
        <Select
          label="Program"
          placeholder="Select program"
          options={programOptions}
          error={errors.program?.message}
          {...register('program')}
        />
        <Select label="Status" options={BATCH_STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
      </form>
    </Modal>
  )
}
