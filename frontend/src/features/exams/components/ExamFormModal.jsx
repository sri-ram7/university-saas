import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select, DatePicker } from '@/components/ui'
import { examSchema } from '../schemas/examSchemas'
import { EXAM_TYPE_OPTIONS } from '../constants/examConstants'
import { useCreateExam } from '../hooks/useExams'
import { useCourseOfferingOptions } from '@/features/courseOfferings/hooks/useCourseOfferings'

export default function ExamFormModal({ isOpen, onClose }) {
  const createMutation = useCreateExam()
  const { options: courseOfferingOptions } = useCourseOfferingOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: '',
      type: 'INTERNAL',
      courseOffering: '',
      examDate: '',
      totalMarks: '',
      passingMarks: '',
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
      title="New exam"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={createMutation.isPending}>
            Create exam
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="Mid-term Examination" error={errors.name?.message} {...register('name')} />
        <Select label="Type" options={EXAM_TYPE_OPTIONS} error={errors.type?.message} {...register('type')} />
        <Select label="Course offering" placeholder="Select course offering" options={courseOfferingOptions} error={errors.courseOffering?.message} {...register('courseOffering')} />
        <DatePicker label="Exam date" error={errors.examDate?.message} {...register('examDate')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Total marks" type="number" min={1} error={errors.totalMarks?.message} {...register('totalMarks')} />
          <Input label="Passing marks" type="number" min={0} error={errors.passingMarks?.message} {...register('passingMarks')} />
        </div>
      </form>
    </Modal>
  )
}
