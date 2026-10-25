import { z } from 'zod'

export const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  department: z.string().min(1, 'Department is required'),
  program: z.string().min(1, 'Program is required'),
  batch: z.string().min(1, 'Batch is required'),
  advisor: z.string().optional().or(z.literal('')),
  section: z.string().optional().or(z.literal('')),
})
