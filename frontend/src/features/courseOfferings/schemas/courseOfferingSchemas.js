import { z } from 'zod'

export const courseOfferingSchema = z.object({
  course: z.string().min(1, 'Course is required'),
  faculty: z.string().min(1, 'Faculty is required'),
  semester: z.string().min(1, 'Semester is required'),
  section: z.string().min(1, 'Section is required'),
  batch: z.string().min(1, 'Batch is required'),
})
