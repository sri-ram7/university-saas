import { z } from 'zod'

export const attendanceSchema = z.object({
  student: z.string().min(1, 'Student is required'),
  course: z.string().min(1, 'Course is required'),
  faculty: z.string().min(1, 'Faculty is required'),
  semester: z.string().min(1, 'Semester is required'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
})
