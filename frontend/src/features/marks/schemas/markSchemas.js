import { z } from 'zod'

export const markSchema = z.object({
  student: z.string().min(1, 'Student is required'),
  exam: z.string().min(1, 'Exam is required'),
  obtainedMarks: z.coerce.number().min(0, 'Obtained marks is required'),
  remarks: z.string().optional(),
})
