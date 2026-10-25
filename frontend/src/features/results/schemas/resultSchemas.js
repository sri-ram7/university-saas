import { z } from 'zod'

export const generateResultSchema = z.object({
  student: z.string().min(1, 'Student is required'),
  semester: z.string().min(1, 'Semester is required'),
})
