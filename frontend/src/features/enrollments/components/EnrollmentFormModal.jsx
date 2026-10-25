import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select, Alert } from '@/components/ui'
import { enrollmentSchema } from '../schemas/enrollmentSchemas'
import { ENROLLMENT_STATUS_OPTIONS } from '../constants/enrollmentConstants'
import { useCreateEnrollment } from '../hooks/useEnrollments'
import { useStudentOptions } from '@/features/students/hooks/useStudents'
import { useCourseOptions } from '@/features/courses/hooks/useCourses'
import { useCourseOfferingOptions } from '@/features/courseOfferings/hooks/useCourseOfferings'

export default function EnrollmentFormModal({ isOpen, onClose }) {
  const createMutation = useCreateEnrollment()
  const { options: studentOptions } = useStudentOptions()
  const { options: courseOptions } = useCourseOptions()
  const { options: courseOfferingOptions } = useCourseOfferingOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      student: '',
      course: '',
      courseOffering: '',
      semester: '',
      academicYear: '',
      status: 'ACTIVE',
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
      title="New enrollment"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Create enrollment
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Select label="Student" placeholder="Select student" options={studentOptions} error={errors.student?.message} {...register('student')} />
        <Select label="Course" placeholder="Select course" options={courseOptions} error={errors.course?.message} {...register('course')} />
        <Select label="Course offering" placeholder="Select course offering" options={courseOfferingOptions} error={errors.courseOffering?.message} {...register('courseOffering')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Semester (1-8)" type="number" min={1} max={8} error={errors.semester?.message} {...register('semester')} />
          <Input label="Academic year" placeholder="2025-2026" error={errors.academicYear?.message} {...register('academicYear')} />
        </div>
        <Select label="Status" options={ENROLLMENT_STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
        <Alert tone="info">
          Both course and course offering are required — the backend&apos;s
          validator checks one field while the database record stores the other.
        </Alert>
      </form>
    </Modal>
  )
}
