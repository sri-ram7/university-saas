import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Modal, Button, Input, TextArea } from '@/components/ui'
import { departmentSchema } from '../schemas/departmentSchemas'
import { useCreateDepartment, useUpdateDepartment } from '../hooks/useDepartments'

export default function DepartmentFormModal({ isOpen, onClose, department }) {
  const isEdit = !!department
  const createMutation = useCreateDepartment()
  const updateMutation = useUpdateDepartment()
  const isSaving = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(departmentSchema) })

  useEffect(() => {
    if (isOpen) {
      reset(
        isEdit
          ? { name: department.name, code: department.code, description: department.description || '' }
          : { name: '', code: '', description: '' }
      )
    }
  }, [isOpen, isEdit, department, reset])

  const onSubmit = (values) => {
    const action = isEdit
      ? updateMutation.mutateAsync({ id: department._id, payload: values })
      : createMutation.mutateAsync(values)

    action.then(onClose).catch(() => {})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit department' : 'New department'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSaving}>
            {isEdit ? 'Save changes' : 'Create department'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="Computer Science" error={errors.name?.message} {...register('name')} />
        <Input label="Code" placeholder="CSE" error={errors.code?.message} {...register('code')} />
        <TextArea
          label="Description"
          placeholder="Optional description"
          error={errors.description?.message}
          {...register('description')}
        />
      </form>
    </Modal>
  )
}
