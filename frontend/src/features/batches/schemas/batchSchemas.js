import { z } from 'zod'

export const batchSchema = z.object({
  name: z.string().min(1, 'Batch name is required'),
  startYear: z.coerce.number().int().min(2000, 'Enter a valid year'),
  endYear: z.coerce.number().int().min(2000, 'Enter a valid year'),
  program: z.string().min(1, 'Program is required'),
  status: z.enum(['ACTIVE', 'COMPLETED']),
})
