import { z } from 'zod'

// NOTE: backend mismatch — enrollmentValidator requires `course`, but the
// Enrollment model only persists `courseOffering` (required, ref
// CourseOffering). We collect both so the request clears validation and the
// document still saves correctly.
export const enrollmentSchema = z.object({
  student: z.string().min(1, 'Student is required'),
  course: z.string().min(1, 'Course is required'),
  courseOffering: z.string().min(1, 'Course offering is required'),
  semester: z.coerce.number().int().min(1).max(8, 'Semester must be between 1 and 8'),
  academicYear: z.string().min(1, 'Academic year is required'),
  status: z.enum(['ACTIVE', 'COMPLETED', 'DROPPED']),
})
