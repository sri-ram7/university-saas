import { z } from 'zod'

export const programSchema = z.object({
  name: z.string().min(1, 'Program name is required'),
  code: z.string().min(1, 'Program code is required'),
  duration: z.coerce.number().int().min(1, 'Duration must be at least 1 year'),
  department: z.string().min(1, 'Department is required'),
})
