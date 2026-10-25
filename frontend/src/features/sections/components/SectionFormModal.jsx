import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select } from '@/components/ui'
import { sectionSchema } from '../schemas/sectionSchemas'
import { useCreateSection } from '../hooks/useSections'
import { useDepartmentOptions } from '@/features/departments/hooks/useDepartments'
import { useSemesterOptions } from '@/features/semesters/hooks/useSemesters'
import { useFacultyOptions } from '@/features/faculty/hooks/useFaculty'

export default function SectionFormModal({ isOpen, onClose }) {
  const createMutation = useCreateSection()
  const { options: departmentOptions } = useDepartmentOptions()
  const { options: semesterOptions } = useSemesterOptions()
  const { options: facultyOptions } = useFacultyOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: { name: '', department: '', semester: '', faculty: '' },
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
      title="New section"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Create section
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="Section A" error={errors.name?.message} {...register('name')} />
        <Select label="Department" placeholder="Select department" options={departmentOptions} error={errors.department?.message} {...register('department')} />
        <Select label="Semester" placeholder="Select semester" options={semesterOptions} error={errors.semester?.message} {...register('semester')} />
        <Select label="Faculty (section in-charge)" placeholder="Select faculty" options={facultyOptions} error={errors.faculty?.message} {...register('faculty')} />
      </form>
    </Modal>
  )
}
