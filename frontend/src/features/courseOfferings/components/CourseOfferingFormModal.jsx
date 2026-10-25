import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Select } from '@/components/ui'
import { courseOfferingSchema } from '../schemas/courseOfferingSchemas'
import { useCreateCourseOffering } from '../hooks/useCourseOfferings'
import { useCourseOptions } from '@/features/courses/hooks/useCourses'
import { useFacultyOptions } from '@/features/faculty/hooks/useFaculty'
import { useSemesterOptions } from '@/features/semesters/hooks/useSemesters'
import { useSectionOptions } from '@/features/sections/hooks/useSections'
import { useBatchOptions } from '@/features/batches/hooks/useBatches'

export default function CourseOfferingFormModal({ isOpen, onClose }) {
  const createMutation = useCreateCourseOffering()
  const { options: courseOptions } = useCourseOptions()
  const { options: facultyOptions } = useFacultyOptions()
  const { options: semesterOptions } = useSemesterOptions()
  const { options: sectionOptions } = useSectionOptions()
  const { options: batchOptions } = useBatchOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseOfferingSchema),
    defaultValues: { course: '', faculty: '', semester: '', section: '', batch: '' },
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
      title="New course offering"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Create offering
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Select label="Course" placeholder="Select course" options={courseOptions} error={errors.course?.message} {...register('course')} />
        <Select label="Faculty" placeholder="Select faculty" options={facultyOptions} error={errors.faculty?.message} {...register('faculty')} />
        <Select label="Semester" placeholder="Select semester" options={semesterOptions} error={errors.semester?.message} {...register('semester')} />
        <Select label="Section" placeholder="Select section" options={sectionOptions} error={errors.section?.message} {...register('section')} />
        <Select label="Batch" placeholder="Select batch" options={batchOptions} error={errors.batch?.message} {...register('batch')} />
      </form>
    </Modal>
  )
}
