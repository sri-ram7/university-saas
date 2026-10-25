import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select, TextArea, DatePicker } from '@/components/ui'
import { notificationSchema } from '../schemas/notificationSchemas'
import { AUDIENCE_OPTIONS } from '../constants/notificationConstants'
import { useCreateNotification } from '../hooks/useNotifications'

export default function NotificationFormModal({ isOpen, onClose }) {
  const createMutation = useCreateNotification()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: { title: '', message: '', audience: 'ALL', expiresAt: '' },
  })

  const onSubmit = (values) => {
    const payload = { ...values }
    if (!payload.expiresAt) delete payload.expiresAt

    createMutation.mutateAsync(payload).then(() => {
      reset()
      onClose()
    }).catch(() => {})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New notification"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Send notification
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Title" placeholder="Semester registration opens Monday" error={errors.title?.message} {...register('title')} />
        <TextArea label="Message" placeholder="Details for the announcement" error={errors.message?.message} {...register('message')} />
        <Select label="Audience" options={AUDIENCE_OPTIONS} error={errors.audience?.message} {...register('audience')} />
        <DatePicker label="Expires on (optional)" error={errors.expiresAt?.message} {...register('expiresAt')} />
      </form>
    </Modal>
  )
}
