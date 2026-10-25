import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select, TextArea } from '@/components/ui'
import { markSchema } from '../schemas/markSchemas'
import { useCreateMark } from '../hooks/useMarks'
import { useStudentOptions } from '@/features/students/hooks/useStudents'
import { useExamOptions } from '@/features/exams/hooks/useExams'

export default function MarkFormModal({ isOpen, onClose }) {
  const createMutation = useCreateMark()
  const { options: studentOptions } = useStudentOptions()
  const { options: examOptions } = useExamOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(markSchema),
    defaultValues: { student: '', exam: '', obtainedMarks: '', remarks: '' },
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
      title="Record marks"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Save marks
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Select label="Student" placeholder="Select student" options={studentOptions} error={errors.student?.message} {...register('student')} />
        <Select label="Exam" placeholder="Select exam" options={examOptions} error={errors.exam?.message} {...register('exam')} />
        <Input label="Obtained marks" type="number" min={0} error={errors.obtainedMarks?.message} {...register('obtainedMarks')} />
        <TextArea label="Remarks (optional)" placeholder="Any notes about this result" error={errors.remarks?.message} {...register('remarks')} />
      </form>
    </Modal>
  )
}
