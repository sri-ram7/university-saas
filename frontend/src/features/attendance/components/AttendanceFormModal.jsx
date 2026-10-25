import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Select, DatePicker } from '@/components/ui'
import { attendanceSchema } from '../schemas/attendanceSchemas'
import { ATTENDANCE_STATUS_OPTIONS } from '../constants/attendanceConstants'
import { useCreateAttendance } from '../hooks/useAttendance'
import { useStudentOptions } from '@/features/students/hooks/useStudents'
import { useCourseOptions } from '@/features/courses/hooks/useCourses'
import { useFacultyOptions } from '@/features/faculty/hooks/useFaculty'
import { useSemesterOptions } from '@/features/semesters/hooks/useSemesters'

export default function AttendanceFormModal({ isOpen, onClose }) {
  const createMutation = useCreateAttendance()
  const { options: studentOptions } = useStudentOptions()
  const { options: courseOptions } = useCourseOptions()
  const { options: facultyOptions } = useFacultyOptions()
  const { options: semesterOptions } = useSemesterOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { student: '', course: '', faculty: '', semester: '', date: '', status: 'PRESENT' },
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
      title="Record attendance"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Save attendance
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Select label="Student" placeholder="Select student" options={studentOptions} error={errors.student?.message} {...register('student')} />
        <Select label="Course" placeholder="Select course" options={courseOptions} error={errors.course?.message} {...register('course')} />
        <Select label="Faculty" placeholder="Select faculty" options={facultyOptions} error={errors.faculty?.message} {...register('faculty')} />
        <Select label="Semester" placeholder="Select semester" options={semesterOptions} error={errors.semester?.message} {...register('semester')} />
        <DatePicker label="Date" error={errors.date?.message} {...register('date')} />
        <Select label="Status" options={ATTENDANCE_STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
      </form>
    </Modal>
  )
}
