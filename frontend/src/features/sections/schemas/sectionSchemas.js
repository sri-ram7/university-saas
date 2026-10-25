import { z } from 'zod'

export const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  department: z.string().min(1, 'Department is required'),
  semester: z.string().min(1, 'Semester is required'),
  faculty: z.string().min(1, 'Faculty is required'),
})
