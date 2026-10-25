import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Select, Alert } from '@/components/ui'
import { generateResultSchema } from '../schemas/resultSchemas'
import { useGenerateResult } from '../hooks/useResults'
import { useStudentOptions } from '@/features/students/hooks/useStudents'
import { useSemesterOptions } from '@/features/semesters/hooks/useSemesters'

export default function GenerateResultModal({ isOpen, onClose }) {
  const generateMutation = useGenerateResult()
  const { options: studentOptions } = useStudentOptions()
  const { options: semesterOptions } = useSemesterOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(generateResultSchema),
    defaultValues: { student: '', semester: '' },
  })

  const onSubmit = (values) => {
    generateMutation.mutateAsync(values).then(() => {
      reset()
      onClose()
    }).catch(() => {})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate result"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={generateMutation.isPending}>
            Generate
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Select label="Student" placeholder="Select student" options={studentOptions} error={errors.student?.message} {...register('student')} />
        <Select label="Semester" placeholder="Select semester" options={semesterOptions} error={errors.semester?.message} {...register('semester')} />
        <Alert tone="info">
          SGPA, CGPA, and pass/fail status are computed by the backend from
          this student&apos;s recorded marks — nothing else to fill in.
        </Alert>
      </form>
    </Modal>
  )
}
