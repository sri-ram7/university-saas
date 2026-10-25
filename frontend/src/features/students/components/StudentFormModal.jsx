import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Modal, Button, Input, Select } from '@/components/ui'
import { studentSchema } from '../schemas/studentSchemas'
import { useCreateStudent, useUpdateStudent } from '../hooks/useStudents'
import { useDepartmentOptions } from '@/features/departments/hooks/useDepartments'
import { useProgramOptions } from '@/features/programs/hooks/usePrograms'
import { useBatchOptions } from '@/features/batches/hooks/useBatches'
import { useFacultyOptions } from '@/features/faculty/hooks/useFaculty'
import { useSectionOptions } from '@/features/sections/hooks/useSections'

function idOf(value) {
  if (!value) return ''
  return typeof value === 'string' ? value : value._id
}

export default function StudentFormModal({ isOpen, onClose, student }) {
  const isEdit = !!student
  const createMutation = useCreateStudent()
  const updateMutation = useUpdateStudent()
  const isSaving = createMutation.isPending || updateMutation.isPending

  const { options: departmentOptions } = useDepartmentOptions()
  const { options: programOptions } = useProgramOptions()
  const { options: batchOptions } = useBatchOptions()
  const { options: facultyOptions } = useFacultyOptions()
  const { options: sectionOptions } = useSectionOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(studentSchema) })

  useEffect(() => {
    if (isOpen) {
      reset(
        isEdit
          ? {
              name: student.name,
              email: student.email,
              department: idOf(student.department),
              program: idOf(student.program),
              batch: idOf(student.batch),
              advisor: idOf(student.advisor),
              section: idOf(student.section),
            }
          : { name: '', email: '', department: '', program: '', batch: '', advisor: '', section: '' }
      )
    }
  }, [isOpen, isEdit, student, reset])

  const onSubmit = (values) => {
    const payload = { ...values }
    if (!payload.advisor) delete payload.advisor
    if (!payload.section) delete payload.section

    const action = isEdit
      ? updateMutation.mutateAsync({ id: student._id, payload })
      : createMutation.mutateAsync(payload)
    action.then(onClose).catch(() => {})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit student' : 'New student'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSaving}>
            {isEdit ? 'Save changes' : 'Create student'}
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="Alex Johnson" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="alex@university.edu" error={errors.email?.message} {...register('email')} />
        <Select label="Department" placeholder="Select department" options={departmentOptions} error={errors.department?.message} {...register('department')} />
        <Select label="Program" placeholder="Select program" options={programOptions} error={errors.program?.message} {...register('program')} />
        <Select label="Batch" placeholder="Select batch" options={batchOptions} error={errors.batch?.message} {...register('batch')} />
        <Select label="Advisor (optional)" placeholder="Select advisor" options={facultyOptions} error={errors.advisor?.message} {...register('advisor')} />
        <Select label="Section (optional)" placeholder="Select section" options={sectionOptions} error={errors.section?.message} {...register('section')} />
      </form>
    </Modal>
  )
}
