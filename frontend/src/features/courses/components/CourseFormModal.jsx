import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Modal, Button, Input, Select, Alert } from '@/components/ui'
import { courseSchema } from '../schemas/courseSchemas'
import { useCreateCourse, useUpdateCourse } from '../hooks/useCourses'
import { useDepartmentOptions } from '@/features/departments/hooks/useDepartments'
import { useFacultyOptions } from '@/features/faculty/hooks/useFaculty'

export default function CourseFormModal({ isOpen, onClose, course }) {
  const isEdit = !!course
  const createMutation = useCreateCourse()
  const updateMutation = useUpdateCourse()
  const isSaving = createMutation.isPending || updateMutation.isPending
  const { options: departmentOptions } = useDepartmentOptions()
  const { options: facultyOptions } = useFacultyOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(courseSchema) })

  useEffect(() => {
    if (isOpen) {
      reset(
        isEdit
          ? {
              name: course.name,
              code: course.code,
              credits: course.credits,
              semester: 1,
              department: course.department?._id || course.department,
              faculty: course.faculty?._id || course.faculty || '',
            }
          : { name: '', code: '', credits: '', semester: '', department: '', faculty: '' }
      )
    }
  }, [isOpen, isEdit, course, reset])

  const onSubmit = (values) => {
    const action = isEdit
      ? updateMutation.mutateAsync({ id: course._id, payload: values })
      : createMutation.mutateAsync(values)
    action.then(onClose).catch(() => {})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit course' : 'New course'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSaving}>
            {isEdit ? 'Save changes' : 'Create course'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="Data Structures" error={errors.name?.message} {...register('name')} />
        <Input label="Code" placeholder="CS201" error={errors.code?.message} {...register('code')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Credits" type="number" min={1} max={10} error={errors.credits?.message} {...register('credits')} />
          <Input label="Semester (1-8)" type="number" min={1} max={8} error={errors.semester?.message} {...register('semester')} />
        </div>
        <Select label="Department" placeholder="Select department" options={departmentOptions} error={errors.department?.message} {...register('department')} />
        <Select label="Faculty" placeholder="Select faculty" options={facultyOptions} error={errors.faculty?.message} {...register('faculty')} />
        <Alert tone="info">
          Semester and faculty are required by the backend for validation but
          aren&apos;t stored on the course record itself.
        </Alert>
      </form>
    </Modal>
  )
}
