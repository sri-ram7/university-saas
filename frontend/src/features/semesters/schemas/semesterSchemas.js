import { z } from 'zod'

export const semesterSchema = z
  .object({
    name: z.string().min(1, 'Semester name is required'),
    number: z.coerce.number().int().min(1).max(8, 'Number must be between 1 and 8'),
    academicYear: z.string().min(1, 'Academic year is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    status: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED']),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
