import { z } from 'zod'

export const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  type: z.enum(['INTERNAL', 'MID', 'PRACTICAL', 'EXTERNAL']),
  courseOffering: z.string().min(1, 'Course offering is required'),
  examDate: z.string().min(1, 'Exam date is required'),
  totalMarks: z.coerce.number().min(1, 'Total marks is required'),
  passingMarks: z.coerce.number().min(0, 'Passing marks is required'),
})
