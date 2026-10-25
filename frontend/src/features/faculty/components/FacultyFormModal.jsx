import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Modal, Button, Input, Select } from '@/components/ui'
import { facultySchema } from '../schemas/facultySchemas'
import { useCreateFaculty, useUpdateFaculty } from '../hooks/useFaculty'
import { useDepartmentOptions } from '@/features/departments/hooks/useDepartments'

export default function FacultyFormModal({ isOpen, onClose, faculty }) {
  const isEdit = !!faculty
  const createMutation = useCreateFaculty()
  const updateMutation = useUpdateFaculty()
  const isSaving = createMutation.isPending || updateMutation.isPending
  const { options: departmentOptions } = useDepartmentOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(facultySchema) })

  useEffect(() => {
    if (isOpen) {
      reset(
        isEdit
          ? {
              name: faculty.name,
              email: faculty.email,
              phone: faculty.phone,
              designation: faculty.designation,
              department: faculty.department?._id || faculty.department,
            }
          : { name: '', email: '', phone: '', designation: '', department: '' }
      )
    }
  }, [isOpen, isEdit, faculty, reset])

  const onSubmit = (values) => {
    const action = isEdit
      ? updateMutation.mutateAsync({ id: faculty._id, payload: values })
      : createMutation.mutateAsync(values)
    action.then(onClose).catch(() => {})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit faculty' : 'New faculty'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSaving}>
            {isEdit ? 'Save changes' : 'Create faculty'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="Dr. Jane Smith" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="jane.smith@university.edu" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" placeholder="+1 555 010 2020" error={errors.phone?.message} {...register('phone')} />
        <Input label="Designation" placeholder="Associate Professor" error={errors.designation?.message} {...register('designation')} />
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
